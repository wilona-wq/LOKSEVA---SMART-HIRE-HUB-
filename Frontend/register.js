// Register form handling
let tempUserData = {}; // Store user data until OTP verification

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

    // Call API
    const response = await apiCall("/auth/register", "POST", tempUserData);

    showMessage(`msg-${role}`, response.message, "success");

    // Show OTP section
    document.getElementById(`otp-section-${role}`).classList.add("show");
  } catch (error) {
    showMessage(`msg-${role}`, error.message, "error");
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
