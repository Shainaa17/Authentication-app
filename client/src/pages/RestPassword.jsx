import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const RestPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  /* ---------- Local state ---------- */
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  /* ---------- OTP inputs ref ---------- */
  const inputRefs = useRef(Array(6).fill(null));

  /* ---------- OTP input helpers ---------- */
  const handleInput = (e, idx) => {
    if (e.target.value.length > 0 && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && e.target.value === "" && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").slice(0, 6);
    text.split("").forEach((ch, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = ch;
    });
    if (text.length > 0) inputRefs.current[text.length - 1].focus();
  };

  /* ---------- Submit handlers ---------- */
  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submitOtp = (e) => {
    e.preventDefault();
    const val = inputRefs.current.map((el) => el.value).join("");
    setOtp(val);
    setIsOtpSubmitted(true);
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/resetPassword`,
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="reset-container">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="reset-logo"
          onClick={() => navigate("/")}
        />

        {/* ---------- STEP 1: enter email ---------- */}
        {!isEmailSent && (
          <form onSubmit={submitEmail} className="reset-card">
            <h1 className="card-title">Reset password</h1>
            <p className="card-sub">Enter your registered email address</p>

            <div className="input-group">
              <img src={assets.mail_icon} alt="mail" className="icon-sm" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email"
              />
            </div>

            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
        )}

        {/* ---------- STEP 2: enter OTP ---------- */}
        {isEmailSent && !isOtpSubmitted && (
          <form onSubmit={submitOtp} className="reset-card otp-card">
            <h1 className="card-title">Reset Password OTP</h1>
            <p className="card-sub">Enter the 6‑digit code sent to your email</p>

            <div className="otp-box" onPaste={handlePaste}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  required
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onInput={(e) => handleInput(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="otp-input"
                />
              ))}
            </div>

            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
        )}

        {/* ---------- STEP 3: new password ---------- */}
        {isEmailSent && isOtpSubmitted && (
          <form onSubmit={submitNewPassword} className="reset-card">
            <h1 className="card-title">New password</h1>
            <p className="card-sub">Enter your new password</p>

            <div className="input-group">
              <img src={assets.lock_icon} alt="lock" className="icon-sm" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Password"
              />
            </div>

            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
        )}
      </div>

      {/* ----------- PURE CSS -------------- */}
      <style>{`
        /* Container & background */
        .reset-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #bfdbfe 0%, #c084fc 100%);
          position: relative;
        }
        .reset-logo {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          width: 7rem;
          cursor: pointer;
        }
        @media (min-width:640px){
          .reset-logo{left:5rem;width:8rem;}
        }

        /* Card */
        .reset-card {
          width: 24rem;
          background:#1e293b;
          color:#fff;
          padding:2rem;
          border-radius:0.75rem;
          box-shadow:0 10px 15px rgba(0,0,0,.1);
          text-align:center;
          font-size:0.875rem;
        }
        .card-title {
          font-size:1.5rem;
          font-weight:600;
          margin-bottom:1rem;
        }
        .card-sub {
          color:#c7d2fe;
          margin-bottom:1.5rem;
        }

        /* Inputs */
        .input-group {
          display:flex;
          align-items:center;
          gap:0.75rem;
          background:#333a5c;
          padding:0.625rem 1.25rem;
          border-radius:9999px;
          margin-bottom:1rem;
        }
        .icon-sm{width:0.75rem;height:0.75rem;}
        .input-field{
          flex:1;
          background:transparent;
          border:none;
          outline:none;
          color:#fff;
        }

        /* OTP */
        .otp-card{padding-bottom:2.5rem;}
        .otp-box{
          display:flex;
          justify-content:space-between;
          margin-bottom:2rem;
        }
        .otp-input{
          width:3rem;
          height:3rem;
          text-align:center;
          font-size:1.25rem;
          background:#333a5c;
          color:#fff;
          border:none;
          border-radius:0.375rem;
          outline:none;
        }

        /* Buttons */
        .btn-primary{
          width:100%;
          padding:0.75rem 1rem;
          border:none;
          border-radius:9999px;
          background:linear-gradient(90deg,#6366f1 0%, #3730a3 100%);
          color:#fff;
          font-weight:600;
          cursor:pointer;
          transition:opacity .25s ease;
        }
        .btn-primary:hover{opacity:.9;}
      `}</style>
    </>
  );
};

export default RestPassword;
