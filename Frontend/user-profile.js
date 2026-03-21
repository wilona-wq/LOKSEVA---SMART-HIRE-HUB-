// User Profile Management

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();
  
  try {
    const user = await getUserProfile();
    
    if (user) {
      // Populate navbar
      document.getElementById("profile-user-name").textContent = user.name || "User";
      
      // Populate avatar with initials
      const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';
      document.getElementById("avatar").textContent = initials;
      
      // Populate avatar name
      document.getElementById("avatar-name").textContent = user.name || "User";
      
      // Populate form with user data
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("address").value = user.address || "";
      document.getElementById("city").value = user.city || "";
      
      console.log("✅ User profile loaded:", user);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    showMessage("msg-profile", "Error loading profile data", "error");
  }
});

// Handle profile form submission
async function saveProfile(e) {
  console.log("💾 Save profile clicked");
  if (e) e.preventDefault();
  
  try {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    
    console.log("📝 Form data:", { name, phone, address, city });
    
    const profileData = {
      name: name,
      phone: phone,
      address: address,
      city: city,
    };

    // Validation
    if (!profileData.name || !profileData.phone) {
      console.warn("❌ Validation failed: Missing required fields");
      showMessage("msg-profile", "Please fill in all required fields", "error");
      return;
    }

    const btn = document.getElementById("save-btn");
    if (!btn) {
      console.error("❌ Save button not found!");
      return;
    }
    
    btn.disabled = true;
    btn.innerHTML = "Saving...";
    console.log("🔄 Sending update request to API...");

    const response = await updateUserProfile(profileData);
    console.log("✅ API Response:", response);
    
    showMessage("msg-profile", "Profile updated successfully! 🎉", "success");
    
    // Update avatar initials
    const initials = profileData.name
      ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
    document.getElementById("avatar").textContent = initials;
    document.getElementById("avatar-name").textContent = profileData.name;
    document.getElementById("profile-user-name").textContent = profileData.name;
    
    console.log("✅ Profile updated successfully");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    showMessage("msg-profile", error.message || "Error updating profile", "error");
  } finally {
    const btn = document.getElementById("save-btn");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "Save Changes";
    }
  }
}

// Cancel and go back
function cancelEdit() {
  window.location.href = "user-dashboard.html";
}
