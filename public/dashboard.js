// ========================================
// CUSTOM NOTIFICATION
// ========================================

function showNotification(
    message,
    title = "Success",
    type = "success"
) {

    const modal =
        document.getElementById("notificationModal");

    const icon =
        document.getElementById("notificationIcon");

    const titleElement =
        document.getElementById("notificationTitle");

    const messageElement =
        document.getElementById("notificationMessage");


    titleElement.textContent = title;

    messageElement.textContent = message;


    if (type === "success") {

        icon.textContent = "✓";

        icon.style.background = "#dcfce7";

        icon.style.color = "#16a34a";

    }

    else if (type === "error") {

        icon.textContent = "!";

        icon.style.background = "#fee2e2";

        icon.style.color = "#dc2626";

    }

    else if (type === "warning") {

        icon.textContent = "!";

        icon.style.background = "#fef3c7";

        icon.style.color = "#d97706";

    }


    modal.classList.add("show");
}


function closeNotification() {

    const modal =
        document.getElementById("notificationModal");

    modal.classList.remove("show");
}
// ===============================
// Dashboard Variables
// ===============================

let generatedCount = 0;
let strongPasswordCount = 0;


// ===============================
// Generate Password
// ===============================

async function generatePassword() {

    try {

        const length =
            parseInt(document.getElementById("length").value);

        const uppercase =
            document.getElementById("uppercase").checked;

        const lowercase =
            document.getElementById("lowercase").checked;

        const numbers =
            document.getElementById("numbers").checked;

        const symbols =
            document.getElementById("symbols").checked;


        // Check at least one option

        if (!uppercase && !lowercase && !numbers && !symbols) {

            alert("Please select at least one character type.");

            return;
        }


        const response = await fetch(
            "http://localhost:3000/api/password/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    length,
                    uppercase,
                    lowercase,
                    numbers,
                    symbols
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message || "Password generation failed.");

            return;
        }


        // Display password

        document.getElementById("generatedPassword").value =
            data.password;


        // Update statistics

        generatedCount++;

        document.getElementById("totalGenerated").textContent =
            generatedCount;


        // Check password strength

        checkPasswordStrength(data.password);

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }
}



// ===============================
// Password Strength
// ===============================

function checkPasswordStrength(password) {

    let score = 0;


    // Length

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }


    // Lowercase

    if (/[a-z]/.test(password)) {
        score++;
    }


    // Uppercase

    if (/[A-Z]/.test(password)) {
        score++;
    }


    // Numbers

    if (/[0-9]/.test(password)) {
        score++;
    }


    // Symbols

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    const strength =
        document.getElementById("strength");


    if (score <= 2) {

        strength.textContent =
            "Weak Password";

        strength.style.color =
            "#e53935";

    }

    else if (score <= 4) {

        strength.textContent =
            "Medium Password";

        strength.style.color =
            "#ff9800";

    }

    else {

        strength.textContent =
            "Strong Password";

        strength.style.color =
            "#00a67d";

        strongPasswordCount++;

        document.getElementById("strongCount").textContent =
            strongPasswordCount;
    }
}



// ===============================
// Copy Password
// ===============================

async function copyPassword() {

    const password =
        document.getElementById("generatedPassword").value;


    if (password === "") {

        alert("Generate a password first!");

        return;
    }


    try {

        await navigator.clipboard.writeText(password);

        alert("Password Copied!");

    }

    catch (error) {

        // Fallback for older browsers

        const passwordInput =
            document.getElementById("generatedPassword");

        passwordInput.select();

        document.execCommand("copy");

        alert("Password Copied!");
    }
}



// ===============================
// Save Password
// ===============================

async function savePassword() {

    const password =
        document.getElementById("generatedPassword").value;


    if (password === "") {

        alert("Generate a password first!");

        return;
    }


    const strength =
        document.getElementById("strength").textContent;


    try {

        const response = await fetch(
            "http://localhost:3000/api/password/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: 1,

                    password,

                    strength

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message || "Unable to save password.");

            return;
        }


        alert(data.message);

        loadPasswords();

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }
}



// ===============================
// Load Saved Passwords
// ===============================

async function loadPasswords() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/password/all"
        );


        const passwords =
            await response.json();


        const passwordList =
            document.getElementById("passwordList");


        document.getElementById("totalSaved").textContent =
            passwords.length;


        if (passwords.length === 0) {

            passwordList.innerHTML = `
                <p class="empty-message">
                    No saved passwords yet.
                </p>
            `;

            return;
        }


        let html = "";


        passwords.forEach((item) => {

            html += `

                <div class="password-card">

                    <p>
                        <strong>Password:</strong>
                        ${item.password}
                    </p>

                    <p>
                        <strong>Strength:</strong>
                        ${item.strength}
                    </p>

                    <button
                        onclick="copySavedPassword('${item.password}')"
                    >
                        📋 Copy
                    </button>

                    <button
                        onclick="deletePassword(${item.id})"
                    >
                        🗑 Delete
                    </button>

                </div>

            `;

        });


        passwordList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        console.log("Unable to load saved passwords.");

    }
}



// ===============================
// Copy Saved Password
// ===============================

async function copySavedPassword(password) {

    try {

        await navigator.clipboard.writeText(password);

        alert("Password Copied!");

    }

    catch (error) {

        alert("Unable to copy password.");

    }
}



// ===============================
// Delete Password
// ===============================

async function deletePassword(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this password?");


    if (!confirmDelete) {
        return;
    }


    try {

        await fetch(
            `http://localhost:3000/api/password/${id}`,
            {
                method: "DELETE"
            }
        );


        loadPasswords();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete password.");

    }
}



// ===============================
// Clear All Passwords
// ===============================

async function clearPasswords() {

    const confirmClear =
        confirm(
            "Are you sure you want to delete all saved passwords?"
        );


    if (!confirmClear) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/password/all"
            );


        const passwords =
            await response.json();


        for (const item of passwords) {

            await fetch(
                `http://localhost:3000/api/password/${item.id}`,
                {
                    method: "DELETE"
                }
            );

        }


        loadPasswords();

    }

    catch (error) {

        console.error(error);

        alert("Unable to clear passwords.");

    }
}



// ===============================
// Dark Mode
// ===============================

const themeBtn =
    document.getElementById("themeBtn");


if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");


        if (
            document.body.classList.contains("dark-mode")
        ) {

            themeBtn.textContent =
                "☀️ Light Mode";

        }

        else {

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    });

}



// ===============================
// Logout
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout =
            confirm("Are you sure you want to logout?");


        if (confirmLogout) {

            // JWT logout will be connected later

            localStorage.removeItem("token");

            window.location.href =
                "index.html";

        }

    });

}



// ===============================
// Load passwords when dashboard opens
// ===============================

loadPasswords();