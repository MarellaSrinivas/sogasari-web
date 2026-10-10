import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate client prevents refresh requests from triggering
// the same response interceptor.
const refreshApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const ACCESS_KEY = "sogasari_token";
const REFRESH_KEY = "sogasari_refresh_token";
const USER_KEY = "sogasari_user";

let isRefreshing = false;
let pendingRequests = [];

const processPendingRequests = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  pendingRequests = [];
};

const logoutUser = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(
    new CustomEvent("sogasari-auth-changed")
  );

  window.dispatchEvent(
    new CustomEvent("sogasari-wishlist-changed")
  );
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_KEY);

    if (!refreshToken) {
      logoutUser();
      return Promise.reject(error);
    }

    // If another request is already refreshing the token,
    // wait for it rather than sending another refresh request.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshApi.post(
        "/auth/refresh",
        { refreshToken }
      );

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Invalid token refresh response");
      }

      localStorage.setItem(ACCESS_KEY, newAccessToken);
      localStorage.setItem(REFRESH_KEY, newRefreshToken);

      processPendingRequests(null, newAccessToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processPendingRequests(refreshError);
      logoutUser();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;