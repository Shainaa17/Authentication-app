import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {toast} from 'react-toastify';
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
  const logout=async()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl+'/api/auth/logout')
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const sendVerificationOtp=async()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp');
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="custom-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <img
            src={assets.logo}
            alt="auth logo"
            className="navbar-logo"
            onClick={() => navigate('/')}
          />

          {/* Conditionally Render: User Profile or Login Button */}
          {userData ? (
            <div className="user-circle">
              {userData.name[0].toUpperCase()}
              <div className="dropdown-menu">
                <ul>
                  {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="dropdown-item">Verify Email</li>}
                  <li
                    className="dropdown-item"
                    onClick={() => logout() }
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="login-btn">
              <span>Login</span>
              <img src={assets.arrow_icon} alt="arrow" className="arrow-icon" />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .custom-navbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 4rem;
          position: fixed;
          top: 0;
          left: 0;
          background-color: white;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          width: 8rem;
          object-fit: contain;
          cursor: pointer;
        }

        .login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #999;
          border-radius: 999px;
          padding: 0.5rem 1.2rem;
          color: #2d2d2d;
          font-weight: 500;
          font-size: 0.9rem;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .login-btn:hover {
          background-color: #f2f2f2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .arrow-icon {
          width: 1rem;
          height: 1rem;
          object-fit: contain;
        }

        .user-circle {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
          color: #fff;
          border-radius: 50%;
          position: relative;
          font-weight: 600;
          cursor: pointer;
        }

        .user-circle:hover .dropdown-menu {
          display: block;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #f5f5f5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-radius: 0.5rem;
          padding-top: 0.5rem;
          z-index: 999;
          width: 140px;
        }

        .dropdown-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .dropdown-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #2d2d2d;
        }

        .dropdown-item:hover {
          background-color: #e5e5e5;
        }
      `}</style>
    </>
  );
};

export default Navbar;
