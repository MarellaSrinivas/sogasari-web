import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_URL = "http://localhost:8080";

function AdminLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("phone");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/auth/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "This number is not authorized."
        );
      }

      setMessage("OTP sent successfully.");
      setStep("otp");

    } catch (err) {
      setError(
        err.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/auth/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid OTP."
        );
      }

      // Save admin authentication
      localStorage.setItem(
        "adminToken",
        data.accessToken
      );

      localStorage.setItem(
        "admin",
        JSON.stringify({
          id: data.adminId,
          phone: data.phone,
          name: data.name,
          role: "ADMIN",
        })
      );

      navigate("/admin", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const changePhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">

          <div className="admin-logo">
            S
          </div>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage your store
          </p>

        </div>

        {step === "phone" && (

          <form
            onSubmit={sendOtp}
            className="admin-login-form"
          >

            <label>
              Mobile Number
            </label>

            <div className="phone-input">

              <span>+91</span>

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                maxLength={10}
                autoFocus
              />

            </div>

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-login-button"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>

        )}

        {step === "otp" && (

          <form
            onSubmit={verifyOtp}
            className="admin-login-form"
          >

            <div className="otp-info">

              <p>
                OTP sent to
              </p>

              <strong>
                +91 {phone}
              </strong>

              <button
                type="button"
                onClick={changePhone}
                className="change-number"
              >
                Change number
              </button>

            </div>

            <label>
              Enter OTP
            </label>

            <input
              className="otp-input"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              maxLength={6}
              autoFocus
            />

            {message && (
              <div className="admin-success">
                {message}
              </div>
            )}

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-login-button"
            >
              {loading
                ? "Verifying..."
                : "Verify & Login"}
            </button>

          </form>

        )}

      </div>

    </div>
  );
}

export default AdminLogin;