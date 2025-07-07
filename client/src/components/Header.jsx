import React, { useContext } from 'react'; // ✅ Add useContext here
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';


const Header = () => {

    const {userData}=useContext(AppContext)

  return (
    <>
      <div className="header-container">
        <img src={assets.header_img} alt="robot" className="robot-img" />

        <h1 className="subtitle">
          Hey {userData?userData.name:"Developer"};
          <img src={assets.hand_wave} alt="wave" className="hand-emoji" />
        </h1>

        <h2 className="title">Welcome to our app</h2>

        <p className="description">
          Let’s start with a quick product tour and we’ll have you up and running in no time!
        </p>

        <button className="start-btn">Get Started</button>
      </div>

      {/* CSS styles */}
      <style>{`
        .header-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 4rem;
          padding: 1rem;
          font-family: 'Segoe UI', sans-serif;
          color: #2d2d2d;
        }

        .robot-img {
          width: 144px;
          height: 144px;
          object-fit: contain;
          border-radius: 50%;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .hand-emoji {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 0.95rem;
          max-width: 400px;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .start-btn {
          padding: 10px 20px;
          font-size: 0.95rem;
          border-radius: 999px;
          border: 1px solid #ccc;
          background-color: transparent;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .start-btn:hover {
          background-color: #f3f3f3;
        }
      `}</style>
    </>
  );
};

export default Header;
