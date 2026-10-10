import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Package } from "lucide-react";

import { sendOtp, verifyOtp } from "../../api/authApi";
import "./Account.css";
import Header from "../../components/Header/Header";
import { syncWishlistAfterLogin } from "../../api/wishlistApi";


function Account() {
  const navigate = useNavigate();

  const [step, setStep] = useState("phone");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const token =
    localStorage.getItem("sogasari_token");

  const storedUser =
    localStorage.getItem("sogasari_user");

  React.useEffect(() => {
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setStep("account");
      } catch {
        localStorage.removeItem(
          "sogasari_user"
        );
      }
    }
  }, [token, storedUser]);

  const handleSendOtp = async () => {
    setError("");

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError(
        "Enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setLoading(true);

      await sendOtp(phone);

      setStep("otp");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");

    if (!/^[0-9]{4,10}$/.test(otp)) {
      setError("Enter a valid OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOtp(
        phone,
        otp
      );

      localStorage.setItem(
        "sogasari_token",
        response.accessToken
      );
localStorage.setItem(
  "sogasari_refresh_token",
  response.refreshToken
);

// Merge the guest wishlist into the user's account.
try {
  await syncWishlistAfterLogin();
} catch (error) {
  console.error("Wishlist sync failed:", error);
}


      const userData = {
        userId: response.userId,
        phone: response.phone,
        name: response.name,
        email: response.email,
        newUser: response.newUser,
      };

      localStorage.setItem(
        "sogasari_user",
        JSON.stringify(userData)
      );

      setUser(userData);
      setStep("account");

      
      window.dispatchEvent(
  new CustomEvent(
    "sogasari-wishlist-changed"
  )


  
  

  
);

window.dispatchEvent(
  new CustomEvent(
    "sogasari-auth-changed"
  )
);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "sogasari_token"
    );

      localStorage.removeItem(
      "sogasari_refresh_token"
    );

    localStorage.removeItem(
      "sogasari_user"
    );

    setUser(null);
    setPhone("");
    setOtp("");
    setStep("phone");
  };

  /*
   * ===============================
   * ACCOUNT
   * ===============================
   */

  if (step === "account") {
    return (
      <div>
                        <Header />

      <div className="account-page">

        <div className="account-container">


          <div className="account-header">
            <div>
              <span className="account-eyebrow">
                MY ACCOUNT
              </span>

              <h1>
                {user?.name
                  ? `Welcome, ${user.name}`
                  : "Welcome to Sogasari"}
              </h1>

              <p>
                {user?.phone}
              </p>
            </div>

            <button
              className="account-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <div className="account-grid">

            <button
              className="account-card"
              onClick={() =>
                navigate("/account/orders")
              }
            >
              <div className="account-card-icon">
                <Package size={24} />
              </div>

              <div>
                <h2>My Orders</h2>

                <p>
                  View your orders and track
                  their status.
                </p>
              </div>
            </button>

            <button
              className="account-card"
              onClick={() =>
                navigate("/wishlist")
              }
            >
              <div className="account-card-icon">
                ♡
              </div>

              <div>
                <h2>Wishlist</h2>

                <p>
                  View your saved products.
                </p>
              </div>
            </button>

          </div>

        </div>

      </div>

      </div>
    );
  }

  /*
   * ===============================
   * OTP
   * ===============================
   */

  if (step === "otp") {
    return (
      <div className="account-page">

        <div className="otp-box">

          <button
            className="back-button"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError("");
            }}
          >
            <ArrowLeft size={18} />
            Change number
          </button>

          <span className="account-eyebrow">
            VERIFY MOBILE
          </span>

          <h1>
            Enter OTP
          </h1>

          <p className="otp-description">
            We sent a verification code to
          </p>

          <strong className="otp-phone">
            +91 {phone}
          </strong>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="Enter OTP"
            className="otp-input"
          />

          {error && (
            <div className="account-error">
              {error}
            </div>
          )}

          <button
            className="account-primary-button"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </div>

      </div>
    );
  }

  /*
   * ===============================
   * PHONE
   * ===============================
   */

  return (
    <div className="account-page">

      <div className="otp-box">

        <span className="account-eyebrow">
          SOGASARI ACCOUNT
        </span>

        <h1>
          Welcome Back
        </h1>

        <p className="otp-description">
          Enter your mobile number to access
          your account, orders and wishlist.
        </p>

        <div className="phone-input-wrapper">
          <span>+91</span>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="Mobile number"
          />
        </div>

        {error && (
          <div className="account-error">
            {error}
          </div>
        )}

        <button
          className="account-primary-button"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Continue"}
        </button>

      </div>

    </div>

    
  );
}

export default Account;