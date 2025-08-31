// login.js

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // Retrieve stored user data from localStorage (or sessionStorage)
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Check if stored user exists and credentials match
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        // Redirect to the dashboard if credentials are correct
        window.location.href = "dashboard.html";  // Redirect to the dashboard page
    } else {
        // Display error message if login fails
        loginError.textContent = "Invalid email or password. Please try again.";
    }
});

  