

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTPVerification = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const name = sessionStorage.getItem("registrationName");
  const phone = sessionStorage.getItem("registrationPhone");
  const password = sessionStorage.getItem("registrationPassword");

  // =====================================================
  // VERIFY FIREBASE OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");

    // Check registration data
    if (!name || !phone || !password) {
      setError(
        "Registration session expired. Please register again."
      );
      return;
    }

    // Check Firebase confirmation result
    if (!window.confirmationResult) {
      setError(
        "OTP session expired. Please register again."
      );
      return;
    }

    // OTP validation
    if (otp.length !== 6) {
      setError("Please enter a valid 6 digit OTP.");
      return;
    }

    try {
      setLoading(true);

      console.log("Verifying Firebase OTP...");

      // =================================================
      // STEP 1: VERIFY OTP WITH FIREBASE
      // =================================================

      const result =
        await window.confirmationResult.confirm(otp);

      console.log(
        "Firebase phone verification successful:",
        result.user.phoneNumber
      );

      // =================================================
      // STEP 2: CREATE USER IN MONGODB
      // =================================================

      const response = await axios.post(
        "https://local-fix-india-backend.vercel.app/api/auth/register",
        {
          name: name,
          phone: `+91${phone}`,
          password: password,
        }
      );

      // =================================================
      // STEP 3: SUCCESS
      // =================================================

      if (response.data.success) {
        alert("Registration successful! 🎉");

        // Clear temporary registration data
        sessionStorage.removeItem(
          "registrationName"
        );

        sessionStorage.removeItem(
          "registrationPhone"
        );

        sessionStorage.removeItem(
          "registrationPassword"
        );

        // Clear Firebase confirmation result
        window.confirmationResult = null;

        // Go to login
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error
      );

      // Firebase errors
      if (
        error.code ===
        "auth/invalid-verification-code"
      ) {
        setError(
          "Invalid OTP. Please enter the correct OTP."
        );
      } else if (
        error.code === "auth/code-expired"
      ) {
        setError(
          "OTP has expired. Please register again."
        );
      } else if (
        error.response?.data?.message
      ) {
        // Backend error
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "OTP verification failed. Please try again."
        );
      }
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

        {/* Phone */}
        <div className="otp-email">
          +91 {phone || "Phone number not found"}
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
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setOtp(value);
              }}
              autoComplete="one-time-code"
              required
            />

            <small>
              Enter the 6-digit code sent to
              your phone
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
            Wrong phone number?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Register Again
          </button>

        </div>

      </div>

    </div>
  );
};

export default OTPVerification;