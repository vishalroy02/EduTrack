const API_URL = "http://localhost:5000/api/auth";


// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    const response = await fetch(`${API_URL}/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      window.location.href = "login.html";
    }
  });
}



// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {

 // Save Login Data
localStorage.setItem("token", data.token);
localStorage.setItem("role", data.user.role);
localStorage.setItem("userId", data.user._id);
localStorage.setItem("name", data.user.name);

// First Login Password Change
if (
    (data.user.role === "teacher" || data.user.role === "parent") &&
    data.user.mustChangePassword
) {
    window.location.href = "pages/change-password.html";
}

// Admin
else if (data.user.role === "admin") {
    window.location.href = "pages/admin.html";
}

// Student / Teacher / Parent
else {
    window.location.href = "pages/dashboard.html";
}
    }
  });
}

// ================= PASSWORD SHOW / HIDE =================

function togglePassword(inputId, element) {

    const input = document.getElementById(inputId);

    const icon = element.querySelector("i");

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}