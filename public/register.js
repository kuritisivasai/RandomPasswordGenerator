const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;


    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        // Registration failed
        if (!response.ok) {

            alert(data.message);

            return;
        }


        // =========================
        // AUTOMATIC LOGIN
        // =========================

        // Save JWT token
        localStorage.setItem("token", data.token);


        alert("Account created successfully!");


        // Go directly to dashboard
        window.location.href = "dashboard.html";


    } catch (error) {

        console.error("Registration error:", error);

        alert("Unable to connect to server.");

    }

});