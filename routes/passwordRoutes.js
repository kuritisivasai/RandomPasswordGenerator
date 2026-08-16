const express = require("express");

const router = express.Router();

const {
    generatePassword,
    savePassword,
    getPasswords,
    deletePassword
} = require("../controllers/passwordController");

router.post("/generate", generatePassword);

router.post("/save", savePassword);

router.get("/all", getPasswords);

router.delete("/:id", deletePassword);

module.exports = router;