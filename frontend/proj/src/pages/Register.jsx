import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Send OTP request
      const response = await fetch(
        "http://localhost:5001/api/auth/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        setError(
          data.message || "Unable to send OTP"
        );
        return;
      }

      // Save email temporarily
      sessionStorage.setItem(
        "registrationEmail",
        email
      );

      // Success message
      setSuccess(
        "OTP sent successfully! Check your email."
      );

      // Go to OTP verification page
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Server se connect nahi ho pa raha."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <p>
          Register for your LocalFix India account
        </p>


        {/* Error Message */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* Success Message */}

        {success && (
          <div className="login-success">
            {success}
          </div>
        )}


        <form onSubmit={handleRegister}>

          {/* Name */}

          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {/* Confirm Password */}

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* Signup Button */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Continue"}
          </button>

        </form>


        {/* Login */}

        <p>
          Already have an account?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
            style={{
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
};

export default Register;