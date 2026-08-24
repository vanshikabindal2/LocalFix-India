import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://local-fix-india-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // User information save
      localStorage.setItem("user", JSON.stringify(data.user));

      // Token agar backend bhej raha hai
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/report-problem");
    } catch (error) {
      console.error(error);
      setError("not connected server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Login</h1>
        <p>Login to your LocalFix India account</p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>

<p className="admin-login-link">
  Are you an administrator?{" "}
  <span onClick={() => navigate("/admin-login")}>
    Admin Login
  </span>
</p>

      </div>
    </div>
  );
};

export default Login;