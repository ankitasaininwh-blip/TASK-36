import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(
    () => localStorage.getItem("jwtToken") || ""
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/register" : "/login";

      const response = await axios.post(`${API_URL}${endpoint}`, {
        username,
        password,
      });

      if (mode === "register") {
        setMessage(response.data.message);
        setMode("login");
        setPassword("");
      } else {
        localStorage.setItem("jwtToken", response.data.token);
        setToken(response.data.token);
        setUsername(response.data.username);
        setPassword("");
        setMessage("Login successful!");
        await getProtectedData(response.data.token);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  async function getProtectedData(savedToken = token) {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      setProfile(response.data);
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not access protected route."
      );

      if ([401, 403].includes(err.response?.status)) {
        localStorage.removeItem("jwtToken");
        setToken("");
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    setToken("");
    setProfile(null);
    setPassword("");
    setMessage("Logged out successfully.");
    setError("");
    setMode("login");
  }

  return (
    <main className="page">
      <section className="auth-card">
        <div className="brand-icon">🔐</div>
        <h1>SecureAuth</h1>
        <p className="subtitle">JWT Authentication System</p>

        {token ? (
          <div className="dashboard">
            <h2>Welcome, {username}!</h2>
            <p>You are logged in.</p>

            <button
              className="primary-btn"
              onClick={() => getProtectedData()}
              disabled={loading}
            >
              {loading ? "Checking..." : "Access Protected Route"}
            </button>

            {profile && (
              <div className="profile-box">
                <h3>Protected Data</h3>
                <p>{profile.message}</p>
                <p>Username: {profile.user.username}</p>
              </div>
            )}

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <div className="tabs">
              <button
                className={mode === "login" ? "tab active" : "tab"}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                  setError("");
                }}
              >
                Login
              </button>

              <button
                className={mode === "register" ? "tab active" : "tab"}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                  setError("");
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={mode === "register" ? 6 : 1}
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                required
              />

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : mode === "register"
                  ? "Create Account"
                  : "Login"}
              </button>
            </form>
          </>
        )}

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="security-note">
          🛡️ Protected with JSON Web Tokens
        </div>
      </section>
    </main>
  );
}

export default App;