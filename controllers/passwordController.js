const db = require("../config/db");

// Generate Password
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
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    res.json({
        password
    });
};


// Save Password
const savePassword = (req, res) => {

    const { user_id, password, strength } = req.body;

    const sql =
        "INSERT INTO passwords (user_id, password, strength) VALUES (?, ?, ?)";

    db.query(sql, [user_id, password, strength], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(201).json({
            message: "Password Saved Successfully!"
        });

    });

};
// Get All Saved Passwords
const getPasswords = (req, res) => {

    const sql = "SELECT * FROM passwords";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(result);

    });

};// Delete Password
const deletePassword = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM passwords WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
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

    });

};

// Export Functions
module.exports = {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
};