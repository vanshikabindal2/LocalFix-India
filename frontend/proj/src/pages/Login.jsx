import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://local-fix-india-backend.vercel.app/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password"
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

      setSuccess("Login successful!");

      // Go to Report Problem
      setTimeout(() => {
        navigate("/report-problem");
      }, 1000);

    } catch (error) {
      console.error(
        "Login error:",
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
  // GOOGLE LOGIN
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

      // Go to Report Problem
      setTimeout(() => {
        navigate("/report-problem");
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

        <h1>Login</h1>

        <p>
          Login to your LocalFix India
          account
        </p>

        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="login-success">
            {success}
          </div>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

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
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>

          {/* CONTINUE */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
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
            CONTINUE WITH GOOGLE
        ================================================= */}

        <div
          ref={googleButtonRef}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        ></div>

        {/* REGISTER */}

        <p>
          Don't have an account?{" "}

          <span
            onClick={() =>
              navigate("/register")
            }
            style={{
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Sign Up
          </span>
        </p>

        {/* ADMIN LOGIN */}

        <p className="admin-login-link">
          Are you an administrator?{" "}

          <span
            onClick={() =>
              navigate("/admin-login")
            }
            style={{
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Admin Login
          </span>
        </p>

      </div>

    </div>
  );
};

export default Login;