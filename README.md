# 🔐 AuthFlow – Full Stack Authentication System

A complete authentication system built with **MERN stack (MongoDB, Express, React, Node.js)** featuring:

- 🔑 Login / Signup
- ✅ Email Verification (via OTP)
- 🔄 Password Reset (via OTP)
- 🍪 JWT Auth with Secure Cookies
- 📧 Nodemailer Email Integration
- ⚛️ React Context for Auth State

---

## 📁 Folder Structure

/client → React frontend (Vite)
/server → Express backend
.env → Environment variables
README.md → You’re reading it :)


---

## 🚀 Features

- User registration with hashed passwords (`bcrypt`)
- Login with JWT stored in HTTP-only secure cookies
- Email verification using OTP (One-Time Password)
- Forgot password flow with OTP + reset
- Nodemailer config for sending emails (Gmail or others)
- CORS-secure and production-ready
- Simple and beautiful UI (customizable)

---

## 🔧 Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend | React + Vite + Context API      |
| Backend  | Express.js + Node.js            |
| Database | MongoDB + Mongoose              |
| Auth     | JWT + Cookies                   |
| Mail     | Nodemailer                      |

---

Security Notes


JWT tokens stored in httpOnly cookies

Passwords hashed with bcrypt

OTPs expire after timeout

Environment-based secure cookies (SameSite, Secure)



🧪 Future Improvements


Add Google OAuth

Rate-limit OTP requests

Add resend OTP feature

UI themes (Dark/Light)

