// User Profile Management

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();
  
  try {
    const user = await getUserProfile();
    
    if (user) {
      // Populate form with user data
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("address").value = user.address || "";
      document.getElementById("city").value = user.city || "";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    showMessage("msg-profile", "Error loading profile data", "error");
  }
});

// Handle profile form submission
async function saveProfile(e) {
  if (e) e.preventDefault();
  
  const profileData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
  };

  // Validation
  if (!profileData.name || !profileData.phone) {
    showMessage("msg-profile", "Please fill in all required fields", "error");
    return;
  }

  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.innerHTML = "Saving...";

  try {
    const response = await updateUserProfile(profileData);
    showMessage("msg-profile", response.message, "success");
    
    setTimeout(() => {
      window.location.href = "user-dashboard.html";
    }, 1500);
  } catch (error) {
    showMessage("msg-profile", error.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Save Changes";
  }
}

// Cancel and go back
function cancelEdit() {
  window.location.href = "user-dashboard.html";
}
