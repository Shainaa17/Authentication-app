/* -------------------------------------------
   authController.js
   -------------------------------------------
   Handles register, login, logout, email‑verify,
   send reset‑OTP, reset password.
-------------------------------------------- */

import bcrypt       from 'bcrypt';
import jwt          from 'jsonwebtoken';
import userModel    from '../models/userModel.js';
import transporter  from '../config/nodemailer.js';

/* ---------- REGISTER -------------------- */
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: 'Missing details' });

  try {
    if (await userModel.findOne({ email }))
      return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    /* Cookie */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge : 7 * 24 * 60 * 60 * 1000,
    });

    /* Welcome mail */
    await transporter.sendMail({
      from   : process.env.SENDER_EMAIL,
      to     : email,
      subject: 'Welcome to Great Stack',
      text   : `Welcome – your account has been created with ${email}!`,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- LOGIN ----------------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: 'Email and password required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge  : 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- LOGOUT ---------------------- */
export const logout = (_req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- SEND VERIFY‑OTP ------------- */
export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);   // ✅ from decoded JWT
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (user.isAccountVerified)
      return res.json({ success: false, message: 'Account already verified' });

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    user.verifyOtp         = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from   : process.env.SENDER_EMAIL,
      to     : user.email,
      subject: 'Account verification OTP',
      text   : `Your OTP is ${otp}`,
    });

    return res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- VERIFY E‑MAIL --------------- */
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.json({ success: false, message: 'Missing OTP' });

  try {
    const user = await userModel.findById(req.user.id);   // ✅ from token
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (user.verifyOtp === '' || user.verifyOtp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

    if (user.verifyOtpExpireAt < Date.now())
      return res.json({ success: false, message: 'OTP expired' });

    user.isAccountVerified = true;
    user.verifyOtp         = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- IS‑AUTH --------------------- */
export const isAuthenticated = (_req, res) =>
  res.json({ success: true });

/* ---------- SEND RESET‑OTP -------------- */
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    user.resetOtp         = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from   : process.env.SENDER_EMAIL,
      to     : user.email,
      subject: 'Password reset OTP',
      text   : `Your OTP is ${otp}`,
    });

    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- RESET PASSWORD -------------- */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: 'Enter all details' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (user.resetOtp === '' || user.resetOtp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: 'OTP expired' });

    user.password        = await bcrypt.hash(newPassword, 10);
    user.resetOtp        = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
