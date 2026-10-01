import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const token = localStorage.getItem("adminToken");

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const isAdmin =
    token &&
    admin &&
    admin.role === "ADMIN";

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;