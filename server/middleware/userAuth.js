// userAuth.js (your middleware file)

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies; // Assuming 'cookie-parser' is set up to parse cookies

    if (!token) {
        // Use consistent status codes for errors
        return res.status(401).json({ success: false, message: "Not authenticated. Please login again." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // ⭐⭐⭐ THE FIX: Populate req.user with the decoded ID ⭐⭐⭐
        // It's common to attach a simple object to req.user containing the ID.
        // You can also fetch the full user document here if you need all its properties
        // in subsequent controllers without another DB query.
        req.user = { id: tokenDecode.id };

        // Optional: If you need the full user object in subsequent routes (like in getUserData)
        // you can fetch it here:
        // import userModel from "../models/userModel.js"; // Make sure to import it
        // req.user = await userModel.findById(tokenDecode.id).select('-password');
        // if (!req.user) {
        //     return res.status(401).json({ success: false, message: "User not found associated with token." });
        // }


        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Authentication Middleware Error:", error); // Log the actual error
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please login again." });
        }
        // Handle other JWT errors (e.g., JsonWebTokenError for malformed token)
        return res.status(401).json({ success: false, message: "Not authorized. Invalid token." });
    }
};

export default userAuth;