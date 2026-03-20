// Provider Dashboard Script

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  const user = getStoredUser();
  
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.role !== "provider") {
    window.location.href = "user-dashboard.html";
    return;
  }

  // Display user info
  document.getElementById("provider-name").textContent = user.name;

  // Load provider profile
  await loadProviderProfile(user.id);
});

// Logout function
function logout() {
  clearAuthData();
  window.location.href = "index.html";
}

// Edit profile
function editProfile() {
  window.location.href = "provider_profile.html";
}

// Load provider profile from backend
async function loadProviderProfile(userId) {
  try {
    const user = getStoredUser();
    
    // Try to fetch user profile details
    const profile = await getUserProfile();
    
    if (profile) {
      document.getElementById("provider-name").textContent = profile.name;
      updateProfileDisplay(profile);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// Update profile display
function updateProfileDisplay(profile) {
  const profileSection = document.getElementById("profile-section");
  
  if (profileSection) {
    profileSection.innerHTML = `
      <div class="profile-card">
        <h2>${profile.name}</h2>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Phone:</strong> ${profile.phone}</p>
        <p><strong>City:</strong> ${profile.city || "Not specified"}</p>
        <p><strong>Address:</strong> ${profile.address || "Not specified"}</p>
        <p><strong>Verified:</strong> ${profile.isVerified ? "✅ Yes" : "❌ No"}</p>
      </div>
    `;
  }
}

// Create/Update provider profile
async function handleUpdateProviderProfile(providerData) {
  try {
    const btn = document.getElementById("save-profile-btn");
    btn.disabled = true;
    btn.innerHTML = "Saving...";

    const response = await updateProviderProfile(providerData);
    
    showMessage("msg-profile", "Profile updated successfully!", "success");
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    showMessage("msg-profile", error.message, "error");
  } finally {
    const btn = document.getElementById("save-profile-btn");
    btn.disabled = false;
    btn.innerHTML = "Save Profile";
  }
}

// Load provider ratings and reviews
async function loadRatingsAndReviews() {
  try {
    const user = getStoredUser();
    const profile = await getProviderProfile(user.id);
    
    if (profile) {
      const reviewsSection = document.getElementById("reviews-section");
      if (reviewsSection) {
        reviewsSection.innerHTML = `
          <div class="reviews-card">
            <h3>Your Rating</h3>
            <p class="rating">⭐ ${roundRating(profile.rating)}</p>
            <p><strong>Total Reviews:</strong> ${profile.totalReviews}</p>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

// View available services
function viewServices() {
  const servicesSection = document.getElementById("services-section");
  
  if (servicesSection) {
    servicesSection.innerHTML = `
      <div class="services-list">
        <h3>Available Services</h3>
        <p>Update your available services in your profile.</p>
      </div>
    `;
  }
}

// Toggle availability
async function toggleAvailability() {
  try {
    const user = getStoredUser();
    const currentProfile = await getProviderProfile(user.id);
    
    const newAvailability = !currentProfile.availability;
    
    await updateProviderProfile({
      availability: newAvailability
    });
    
    const statusText = newAvailability ? "Available" : "Not Available";
    showMessage("msg-profile", `Status changed to: ${statusText}`, "success");
  } catch (error) {
    showMessage("msg-profile", error.message, "error");
  }
}

// Handle profile form submission
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profile-form");
  
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(profileForm);
      const data = Object.fromEntries(formData);
      
      try {
        await updateProviderProfile(data);
        showMessage("msg-profile", "Profile updated successfully!", "success");
      } catch (error) {
        showMessage("msg-profile", error.message, "error");
      }
    });
  }
});
