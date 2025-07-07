import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import headerImg from "../assets/logo.svg";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [mode, setMode] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      const url =
        mode === "Sign Up"
          ? `${backendUrl}/api/auth/register`
          : `${backendUrl}/api/auth/login`;

      const payload =
        mode === "Sign Up" ? { name, email, password } : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        // Optional: Store userId in localStorage if returned
        if (data.user?.id) {
          localStorage.setItem("userId", data.user.id);
        }

        setIsLoggedIn(true);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Login failed. Try again."
      );
    }
  };

  return (
    <>
      <style>{`
        body{font-family:'Inter',sans-serif;margin:0;padding:0;box-sizing:border-box;}
        .login-container{display:flex;align-items:center;justify-content:center;min-height:100vh;
          padding:1.5rem;background:linear-gradient(to bottom right,#a7d9ff,#d1a7ff);position:relative;}
        .logo{position:absolute;left:1.25rem;top:1.25rem;width:7rem;cursor:pointer;}
        @media (min-width:640px){.logo{left:5rem;width:8rem;}}
        .login-card{background:#2c2c3e;border-radius:0.75rem;box-shadow:0 10px 15px rgba(0,0,0,.1);
          padding:3rem;width:100%;max-width:28rem;text-align:center;color:#e0e0e0;}
        .login-title{font-size:1.75rem;font-weight:600;margin-bottom:.5rem;}
        .login-subtitle{font-size:.875rem;color:#b0b0b0;margin-bottom:1.5rem;}
        .form-input{width:calc(100% - 2rem);margin-bottom:1rem;padding:.75rem 1rem;border:1px solid #4a4a5c;
          border-radius:.75rem;background:#3a3a4c;color:#e0e0e0;outline:none;}
        .form-input::placeholder{color:#808080;}
        .forgot-password{font-size:.875rem;color:#a7d9ff;text-align:left;margin-bottom:1rem;display:block;cursor:pointer;}
        .submit-button{width:100%;background:#6a0dad;color:#fff;padding:.75rem 1rem;border-radius:.5rem;
          border:none;font-size:1rem;font-weight:600;cursor:pointer;transition:background .3s;}
        .submit-button:hover{background:#7b20c0;}
        .signup-text{font-size:.875rem;color:#b0b0b0;margin-top:1.5rem;}
        .signup-link{color:#a7d9ff;cursor:pointer;font-weight:600;margin-left:.25rem;}
      `}</style>

      <div className="login-container">
        <img
          src={headerImg}
          alt="Auth Logo"
          className="logo"
          onClick={() => navigate("/")}
        />

        <div className="login-card">
          <h2 className="login-title">
            {mode === "Sign Up" ? "Create your account" : "Login"}
          </h2>
          <p className="login-subtitle">
            {mode === "Sign Up"
              ? "Start your journey with us today!"
              : "Login to your account!"}
          </p>

          <form onSubmit={onSubmitHandler}>
            {mode === "Sign Up" && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />

            {mode === "Login" && (
              <span
                className="forgot-password"
                onClick={() => navigate("/reset-password")}
              >
                Forgot password?
              </span>
            )}

            <button type="submit" className="submit-button">
              {mode === "Sign Up" ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="signup-text">
            {mode === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}
            <span
              className="signup-link"
              onClick={() =>
                setMode((prev) => (prev === "Sign Up" ? "Login" : "Sign Up"))
              }
            >
              {mode === "Sign Up" ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
