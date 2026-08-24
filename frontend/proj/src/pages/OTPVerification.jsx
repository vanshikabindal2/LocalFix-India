


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("registrationEmail");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");

    // Email check
    if (!email) {
      setError("Registration session expired. Please register again.");
      return;
    }

    // OTP check
    if (otp.length !== 6) {
      setError("Please enter a valid 6 digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://local-fix-india-backend.vercel.app/api/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP.");
        return;
      }

      // Registration successful
      alert("Registration successful! 🎉");

      // Remove temporary email
      sessionStorage.removeItem("registrationEmail");

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error("OTP Verification Error:", error);

      setError(
        "Server se connect nahi ho pa raha. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">

      <div className="otp-card">

        {/* Icon */}
        <div className="otp-icon">
          🔐
        </div>

        {/* Heading */}
        <h1>Verify OTP</h1>

        <p className="otp-description">
          We have sent a 6-digit verification code to
        </p>

        {/* Email */}
        <div className="otp-email">
          {email || "Email not found"}
        </div>

        {/* Error */}
        {error && (
          <div className="otp-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerifyOTP}>

          <div className="otp-form-group">

            <label>
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="••••••"
              value={otp}
              onChange={(e) => {
                const value =
                  e.target.value.replace(/\D/g, "");

                setOtp(value);
              }}
              autoComplete="one-time-code"
              required
            />

            <small>
              Enter the 6-digit code sent to your email
            </small>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="otp-btn"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        {/* Back */}
        <div className="otp-footer">

          <span>
            Wrong email?
          </span>

          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Register Again
          </button>

        </div>

      </div>

    </div>
  );
};

export default OTPVerification;