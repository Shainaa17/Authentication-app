import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  const navigate = useNavigate();

  /* ---------- Context ---------- */
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  /* ---------- Refs for 6 OTP inputs ---------- */
  const inputRefs = useRef(Array(6).fill(null));

  /* ---------- Helpers ---------- */
  const focusNext = (idx) => {
    if (idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1].focus();
    }
  };
  const focusPrev = (idx) => {
    if (idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleInput = (e, idx) => {
    if (e.target.value.length > 0) focusNext(idx);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && e.target.value === "") focusPrev(idx);
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, idx) => {
      if (inputRefs.current[idx]) inputRefs.current[idx].value = char;
    });
    /* put cursor at last filled box */
    const last = paste.length - 1;
    if (last >= 0 && last < 6) inputRefs.current[last].focus();
  };

  /* ---------- Submit OTP ---------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((el) => el.value).join("");

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  /* ---------- Redirect if already verified ---------- */
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) navigate("/");
  }, [isLoggedIn, userData, navigate]);

  return (
    <>
      <div className="verify-container">
        {/* Logo → home */}
        <img
          src={assets.logo}
          alt="Logo"
          className="verify-logo"
          onClick={() => navigate("/")}
        />

        {/* Card */}
        <form className="verify-card" onSubmit={onSubmitHandler}>
          <h1 className="verify-title">Email Verify OTP</h1>
          <p className="verify-subtitle">
            Enter the 6‑digit code sent to your email id
          </p>

          {/* OTP inputs */}
          <div className="otp-container" onPaste={handlePaste}>
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

          <button type="submit" className="verify-btn">
            Verify Email
          </button>
        </form>
      </div>

      {/* ---------- Plain‑CSS styles ---------- */}
      <style>{`
        .verify-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg,#bfdbfe 0%,#c084fc 100%);
          position: relative;
        }
        .verify-logo {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          width: 7rem;
          cursor: pointer;
        }
        @media (min-width:640px){
          .verify-logo{left:5rem;width:8rem;}
        }
        .verify-card {
          background:#1e293b;
          padding:2rem;
          border-radius:0.75rem;
          box-shadow:0 10px 15px rgba(0,0,0,.1);
          width:24rem;
          text-align:center;
          color:#fff;
          font-size:0.875rem;
        }
        .verify-title {
          font-size:1.5rem;
          font-weight:600;
          margin-bottom:1rem;
        }
        .verify-subtitle {
          color:#c7d2fe;
          margin-bottom:1.5rem;
        }
        .otp-container{
          display:flex;
          justify-content:space-between;
          margin-bottom:2rem;
        }
        .otp-input{
          width:3rem;
          height:3rem;
          text-align:center;
          font-size:1.25rem;
          border:none;
          outline:none;
          border-radius:0.375rem;
          background:#333a5c;
          color:#fff;
        }
        .verify-btn{
          width:100%;
          padding:0.75rem 1rem;
          border:none;
          border-radius:0.5rem;
          background:linear-gradient(90deg,#6366f1 0%,#3730a3 100%);
          color:#fff;
          font-weight:600;
          cursor:pointer;
          transition:opacity .2s ease;
        }
        .verify-btn:hover{opacity:.9;}
      `}</style>
    </>
  );
};

export default EmailVerify;
