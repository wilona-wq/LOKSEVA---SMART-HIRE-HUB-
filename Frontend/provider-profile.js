// Provider Profile Management

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();
  
  const user = getStoredUser();
  
  // Check if editing existing or creating new
  const urlParams = new URLSearchParams(window.location.search);
  const isEditing = urlParams.has("id");
  
  if (isEditing) {
    const providerId = urlParams.get("id");
    await loadProviderProfile(providerId);
  } else {
    // New provider profile - load current user info
    if (user) {
      const userProfile = await getUserProfile();
      if (userProfile) {
        document.getElementById("name").value = userProfile.name || "";
        document.getElementById("email").value = userProfile.email || "";
        document.getElementById("phone").value = userProfile.phone || "";
      }
    }
  }
});

// Load provider profile
async function loadProviderProfile(providerId) {
  try {
    const provider = await getProviderProfile(providerId);
    
    if (provider) {
      // Fill form with provider data
      const user = provider.userId;
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("serviceCategory").value = provider.serviceCategory || "";
      document.getElementById("experience").value = provider.experience || 0;
      document.getElementById("bio").value = provider.bio || "";
      document.getElementById("hourlyRate").value = provider.hourlyRate || 0;
      document.getElementById("skills").value = (provider.skills || []).join(", ");
    }
  } catch (error) {
    console.error("Error loading provider profile:", error);
    showMessage("msg-profile", "Error loading profile data", "error");
  }
}

// Handle profile form submission
async function saveProfile(e) {
  if (e) e.preventDefault();
  
  const user = getStoredUser();
  
  const profileData = {
    serviceCategory: document.getElementById("serviceCategory").value,
    experience: parseInt(document.getElementById("experience").value) || 0,
    bio: document.getElementById("bio").value,
    hourlyRate: parseInt(document.getElementById("hourlyRate").value) || 0,
    skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
  };

  // Validation
  if (!profileData.serviceCategory) {
    showMessage("msg-profile", "Please select a service category", "error");
    return;
  }

  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.innerHTML = "Saving...";

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditing = urlParams.has("id");

    if (isEditing) {
      await updateProviderProfile(profileData);
    } else {
      await createProviderProfile(profileData);
    }

    showMessage("msg-profile", "Profile saved successfully!", "success");
    
    setTimeout(() => {
      window.location.href = "provider-dashboard.html";
    }, 1500);
  } catch (error) {
    showMessage("msg-profile", error.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Save Profile";
  }
}

// Cancel and go back
function cancelEdit() {
  window.location.href = "provider-dashboard.html";
}
