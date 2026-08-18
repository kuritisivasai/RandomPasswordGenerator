const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
} = require("../controllers/passwordController");

// =========================
// JWT AUTHENTICATION
// =========================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Authentication required"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

// Generate password
router.post("/generate", generatePassword);

// Save password - login required
router.post("/save", authenticateToken, savePassword);

// Get passwords - login required
router.get("/all", authenticateToken, getPasswords);

// Delete password - login required
router.delete("/:id", authenticateToken, deletePassword);

module.exports = router;