

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const googleButtonRef = useRef(null);

  // =====================================================
  // GOOGLE SCRIPT
  // =====================================================

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (
        window.google &&
        googleButtonRef.current
      ) {
        window.google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID,

          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: 350,
            text: "continue_with",
            shape: "rectangular",
          }
        );
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // =====================================================
  // NORMAL REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://local-fix-india-backend.vercel.app/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        setError(
          data.message || "Registration failed"
        );
        return;
      }

      // Save user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setSuccess(
        "Registration successful!"
      );

      // Go to Login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Not connected to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN / REGISTER
  // =====================================================

  const handleGoogleResponse = async (
    response
  ) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const googleToken =
        response.credential;

      if (!googleToken) {
        setError(
          "Google authentication failed"
        );
        return;
      }

      const result = await fetch(
        "https://local-fix-india-backend.vercel.app/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: googleToken,
          }),
        }
      );

      const data = await result.json();

      // Backend error
      if (!result.ok) {
        setError(
          data.message ||
            "Google login failed"
        );
        return;
      }

      // Save JWT
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // Save user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setSuccess(
        "Google login successful!"
      );

      // Go Home
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setError(
        "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <p>
          Register for your LocalFix India
          account
        </p>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="login-success">
            {success}
          </div>
        )}

        {/* =================================================
            NORMAL REGISTER FORM
        ================================================= */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

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

          {/* EMAIL */}

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

          {/* PASSWORD */}

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

          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

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

          {/* CONTINUE BUTTON */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Continue"}
          </button>

        </form>

        {/* =================================================
            OR
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            color: "#777",
          }}
        >
          OR
        </div>

        {/* =================================================
            GOOGLE BUTTON
        ================================================= */}

        <div
          ref={googleButtonRef}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        ></div>

        {/* =================================================
            LOGIN
        ================================================= */}

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