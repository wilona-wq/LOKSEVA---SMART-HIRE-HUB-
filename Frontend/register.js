// Register form handling
let tempUserData = {}; // Store user data until OTP verification

// Check if page loaded properly
console.log("✅ register.js loaded successfully");
console.log("🔍 Checking API endpoint:", API_BASE_URL);
console.log("📄 Document ready state:", document.readyState);

// Debug function to manually show OTP for testing
function debugShowOTP(role = 'user') {
  const otpSection = document.getElementById(`otp-section-${role}`);
  if (otpSection) {
    otpSection.classList.add('show');
    console.log("✅ DEBUG: OTP section shown for role:", role);
  } else {
    console.error("❌ DEBUG: OTP section not found for role:", role);
  }
}

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

async function registerUser(role) {
  const nameEl = document.getElementById(`${role}-name`);
  const emailEl = document.getElementById(`${role}-email`);
  const phoneEl = document.getElementById(`${role}-phone`);
  const passwordEl = document.getElementById(`${role}-password`);
  const confirmEl = document.getElementById(`${role}-confirm`);
  const msgEl = document.getElementById(`msg-${role}`);

  // Validation
  if (!nameEl?.value || !emailEl?.value || !phoneEl?.value || !passwordEl?.value) {
    showMessage(`msg-${role}`, "Please fill all fields", "error");
    return;
  }

  if (passwordEl.value !== confirmEl.value) {
    showMessage(`msg-${role}`, "Passwords do not match", "error");
    return;
  }

  if (passwordEl.value.length < 6) {
    showMessage(`msg-${role}`, "Password must be at least 6 characters", "error");
    return;
  }

  // Disable button
  const btn = document.getElementById(`${role}-register-btn`);
  btn.disabled = true;
  btn.innerHTML = "Registering...";

  try {
    // Store data for OTP verification
    tempUserData = {
      name: nameEl.value,
      email: emailEl.value,
      phone: phoneEl.value,
      password: passwordEl.value,
      role,
    };

    console.log("📝 Sending registration data:", tempUserData);

    // Call API
    const response = await apiCall("/auth/register", "POST", tempUserData);

    console.log("✅ Registration response:", response);
    showMessage(`msg-${role}`, "✅ Registration successful! Please enter OTP below.", "success");

    // Show OTP section
    const otpSection = document.getElementById(`otp-section-${role}`);
    console.log("🔍 OTP Section element:", otpSection);
    
    if (otpSection) {
      otpSection.classList.add("show");
      console.log("✅ OTP section made visible");
      
      // Focus on OTP input
      const otpInput = document.getElementById(`${role}-otp`);
      if (otpInput) {
        otpInput.focus();
        console.log("✅ Focus set to OTP input");
      }
    } else {
      console.error("❌ OTP section element not found:", `otp-section-${role}`);
    }
  } catch (error) {
    console.error("❌ Registration error:", error);
    showMessage(`msg-${role}`, "❌ " + (error.message || "Registration failed"), "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  }
}

async function verifyOTP(role) {
  const otpEl = document.getElementById(`${role}-otp`);
  const emailEl = document.getElementById(`${role}-email`);
  const msgEl = document.getElementById(`msg-${role}`);

  if (!otpEl.value) {
    showMessage(`msg-${role}`, "Please enter OTP", "error");
    return;
  }

  const btn = document.getElementById(`${role}-verify-btn`);
  btn.disabled = true;
  btn.innerHTML = "Verifying...";

  try {
    console.log("🔒 Verifying OTP for:", emailEl.value);
    console.log("📝 User Data:", tempUserData);
    
    const response = await verifyUserOTP(
      emailEl.value,
      otpEl.value,
      tempUserData
    );

    console.log("✅ OTP Verification Success:", response);
    showMessage(`msg-${role}`, "✅ Registration successful! Redirecting...", "success");

    // Redirect based on role after 2 seconds
    setTimeout(() => {
      console.log("🔄 Redirecting to dashboard...");
      if (role === "provider") {
        window.location.href = "provider-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    }, 2000);
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    showMessage(`msg-${role}`, "❌ " + (error.message || "OTP verification failed"), "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "✅ Verify OTP";
  }
}

function resendOTP(role) {
  const emailEl = document.getElementById(`${role}-email`);
  showMessage(`msg-${role}`, "OTP resent! (Check terminal in development)", "info");
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOMContentLoaded: register.js initialization");
  console.log("🔗 API_BASE_URL:", API_BASE_URL);
  
  // Check if elements exist
  const userRoleBtn = document.getElementById('user-register-btn');
  const otpSectionUser = document.getElementById('otp-section-user');
  const formSectionUser = document.getElementById('form-user');
  
  console.log("✅ User register button exists:", !!userRoleBtn);
  console.log("✅ OTP section exists:", !!otpSectionUser);
  console.log("✅ Form section exists:", !!formSectionUser);
  
  // Set default role on page load
  selectRole('user');
  console.log("✅ Default role set to 'user'");
});

// For debugging in browser console:
// Call: debugShowOTP('user') to test if OTP section can be shown
