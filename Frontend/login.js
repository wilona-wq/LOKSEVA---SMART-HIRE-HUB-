// Login form handling

function selectRole(role) {
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.remove("active");
    // Find the button for this role and add active
    if (btn.textContent.toLowerCase().includes(role)) {
      btn.classList.add("active");
    }
  });

  document.querySelectorAll(".form-section").forEach((form) => {
    form.classList.remove("active");
  });
  document.getElementById(`form-${role}`).classList.add("active");
}

// Handle login form submission
async function handleUserLogin(role) {
  const emailEl = document.getElementById(`${role}-email`);
  const passwordEl = document.getElementById(`${role}-password`);

  // Validation
  if (!emailEl?.value || !passwordEl?.value) {
    showMessage(`msg-${role}`, "Please enter email and password", "error");
    return;
  }

  const btn = document.getElementById(`${role}-login-btn`);
  btn.disabled = true;
  btn.innerHTML = "Logging in...";

  try {
    // Call the API login function imported from api.js
    const email = emailEl.value;
    const password = passwordEl.value;
    
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.user) {
      throw new Error("Invalid response from server");
    }

    // Save auth data
    setAuthData(data.token, data.user);
    showMessage(`msg-${role}`, data.message || "Login successful", "success");

    // Redirect based on role
    setTimeout(() => {
      if (data.user.role === "provider") {
        window.location.href = "provider-dashboard.html";
      } else if (data.user.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    }, 1500);
  } catch (error) {
    console.error("Login error:", error);
    showMessage(`msg-${role}`, error.message || "Login failed", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  }
}

// Wrapper to maintain compatibility with onclick handlers
async function loginUser(role) {
  return handleUserLogin(role);
}

// Wrapper for API login (from api.js) to avoid naming conflicts
async function apiLoginUser(email, password) {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }
  
  setAuthData(data.token, data.user);
  return data;
}

// Admin login (temporary - for now uses hardcoded credentials)
function adminLogin() {
  const usernameEl = document.getElementById("admin-username");
  const passwordEl = document.getElementById("admin-password");

  if (usernameEl.value === "admin" && passwordEl.value === "admin123") {
    localStorage.setItem("authToken", "admin-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "admin",
        name: "Admin",
        role: "admin",
      })
    );
    window.location.href = "admin-dashboard.html";
  } else {
    showMessage("msg-admin", "Invalid admin credentials", "error");
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Set first role as active
  const firstBtn = document.querySelector(".role-btn");
  if (firstBtn) {
    const firstRole = firstBtn.textContent.toLowerCase().replace(/\s/g, "");
    selectRole(firstRole);
  }
});
