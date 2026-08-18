const db = require("../config/db");

// =========================
// GENERATE PASSWORD
// =========================

const generatePassword = (req, res) => {

    const {
        length,
        uppercase,
        lowercase,
        numbers,
        symbols
    } = req.body;

    let characters = "";

    if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) characters += "0123456789";
    if (symbols) characters += "!@#$%^&*()_+-=[]{}<>?";

    if (characters.length === 0) {
        return res.status(400).json({
            message: "Select at least one character type"
        });
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex =
            Math.floor(Math.random() * characters.length);

        password += characters[randomIndex];
    }

    res.json({
        password
    });
};


// =========================
// SAVE PASSWORD
// =========================

const savePassword = (req, res) => {

    // Get user ID from verified JWT
    const user_id = req.user.id;

    const { password, strength } = req.body;

    if (!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    const sql = `
        INSERT INTO passwords
        (user_id, password, strength)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, password, strength],
        (err, result) => {

            if (err) {
                console.error("Save password error:", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Password Saved Successfully!"
            });

        }
    );

};


// =========================
// GET LOGGED-IN USER PASSWORDS
// =========================

const getPasswords = (req, res) => {

    // Get user ID from verified JWT
    const user_id = req.user.id;

    const sql = `
        SELECT *
        FROM passwords
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [user_id],
        (err, result) => {

            if (err) {
                console.error("Get passwords error:", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json(result);

        }
    );

};


// =========================
// DELETE PASSWORD
// =========================

const deletePassword = (req, res) => {

    const user_id = req.user.id;
    const { id } = req.params;

    // IMPORTANT:
    // Delete only if the password belongs
    // to the currently logged-in user.

    const sql = `
        DELETE FROM passwords
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [id, user_id],
        (err, result) => {

            if (err) {
                console.error("Delete password error:", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Password Not Found"
                });
            }

            res.status(200).json({
                message: "Password Deleted Successfully!"
            });

        }
    );

};


// =========================
// EXPORT
// =========================

module.exports = {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
};