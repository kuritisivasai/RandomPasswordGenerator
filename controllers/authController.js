const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please fill all fields"
        });

    }

    try {

        // Check if email already exists
        const checkSql =
            "SELECT * FROM users WHERE email = ?";

        db.query(
            checkSql,
            [email],
            async (err, result) => {

                if (err) {

                    return res.status(500).json({
                        message: err.message
                    });

                }

                if (result.length > 0) {

                    return res.status(409).json({
                        message: "Email already registered"
                    });

                }

                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // Insert user
                const sql =
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

                db.query(
                    sql,
                    [name, email, hashedPassword],
                    (err, result) => {

                        if (err) {

                            return res.status(500).json({
                                message: err.message
                            });

                        }

                        // Create JWT token
                        const token = jwt.sign(
                            {
                                id: result.insertId,
                                email: email
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: "1h"
                            }
                        );

                        // Send token to frontend
                        res.status(201).json({

                            message:
                                "Account created successfully!",

                            token: token

                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// =========================
// LOGIN USER
// =========================

const loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Please enter email and password"
        });

    }

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        async (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }

            if (result.length === 0) {

                return res.status(401).json({
                    message: "Invalid Email"
                });

            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {

                return res.status(401).json({
                    message: "Invalid Password"
                });

            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.json({

                message: "Login Successful",

                token: token

            });

        }
    );

};


// =========================
// EXPORT
// =========================

module.exports = {
    registerUser,
    loginUser
};