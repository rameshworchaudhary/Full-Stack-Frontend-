import React, { useState } from "react";
import { GraduationCap, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { authApi } from "../api/api";

export function AuthView({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "login") {
        const response = await authApi.login({
          email: form.email.trim(),
          password: form.password,
        });

        const userData = {
          name: response?.name || (response?.data && response.data.name) || form.email.split("@")[0],
          email: form.email.trim(),
        };

        setMessage(response.message || "Authentication successful.");
        setTimeout(() => {
          onLogin(userData);
        }, 400);
      } else {
        const response = await authApi.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setMessage(response.message || "Registration successful! You can now sign in.");
        setForm({
          name: "",
          email: form.email,
          password: "",
        });

        setTimeout(() => {
          setMode("login");
          setMessage("Account created. Please enter your password to sign in.");
        }, 1200);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root-container">
      <div className="auth-card-container">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-brand-logo">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <h1 className="auth-portal-title">Student Portal</h1>
          <p className="auth-portal-subtitle">
            Academic Management & Timetable System
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`tab-switch-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-switch-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              setError("");
              setMessage("");
            }}
          >
            Register Student
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="auth-feedback-box error">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-feedback-box success">
            <CheckCircle2 size={17} />
            <span>{message}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-input-form">
          {mode === "register" && (
            <div className="form-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className="form-control-input"
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="auth-email">Student Email Address</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              className="form-control-input"
              placeholder="student@academic.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              className="form-control-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            {mode === "register" && (
              <span className="field-hint">Minimum 6 characters required</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Connecting to server...</span>
            ) : mode === "login" ? (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Student Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Institutional Footer */}
        <div className="auth-card-footer">
          <p>
            Connected to official Spring Boot REST API
          </p>
        </div>
      </div>
    </div>
  );
}
