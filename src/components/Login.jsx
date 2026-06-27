import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import FloatingHearts from "./FloatingHearts";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("That email or password doesn't match. Try again?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <FloatingHearts density={8} />
      <motion.form
        className="login-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="login-title">Just for you</h1>
        <p className="login-subtitle">Sign in to add or manage memories</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          autoComplete="current-password"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          className="login-back"
          onClick={() => navigate("/home")}
        >
          ← Just take me to the gallery
        </button>
      </motion.form>
    </div>
  );
}
