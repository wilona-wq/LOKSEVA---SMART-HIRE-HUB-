// User Dashboard Script

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  // First, display name from localStorage (immediate)
  const user = getStoredUser();
  if (user && user.name) {
    const firstName = user.name.split(' ')[0];
    document.getElementById("dashboard-name").textContent = firstName;
    document.getElementById("user-name").textContent = user.name;
    console.log("✅ User name from localStorage:", user.name);
  }

  // Then, load fresh user data from API (background)
  try {
    const profile = await getUserProfile();
    if (profile) {
      const firstName = profile.name ? profile.name.split(' ')[0] : 'User';
      document.getElementById("dashboard-name").textContent = firstName;
      document.getElementById("user-name").textContent = profile.name || 'User';
      console.log("✅ User data loaded from API:", profile.name);
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  }

  // Load nearby providers on page load
  await loadNearbyProviders();
});

// Logout function
function logout() {
  clearAuthData();
  window.location.href = "index.html";
}

// Edit profile - Open modal or redirect
function editProfile() {
  window.location.href = "user_profile.html";
}

// Load and display nearby providers
async function loadNearbyProviders() {
  const providersContainer = document.getElementById("providers-list") || 
                             document.querySelector(".providers-grid");

  if (!providersContainer) {
    console.log("Providers container not found");
    return;
  }

  providersContainer.innerHTML = "<p>Loading providers...</p>";

  try {
    // Load all providers immediately (don't wait for geolocation)
    await loadAllProviders(providersContainer);

    // Try to get nearby providers in background (optional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const nearbyProviders = await getNearbyProviders(latitude, longitude, null, 10);
            if (nearbyProviders && nearbyProviders.length > 0) {
              displayProviders(nearbyProviders, providersContainer);
            }
          } catch (error) {
            console.log("Nearby search failed, showing all providers");
          }
        },
        () => {
          // Geolocation denied or unavailable - already showing all providers
        },
        { timeout: 5000 } // 5 second timeout for geolocation request
      );
    }
  } catch (error) {
    providersContainer.innerHTML = `<p>Error loading providers: ${error.message}</p>`;
  }
}

// Load all providers (fallback)
async function loadAllProviders(container) {
  try {
    const providers = await getAllProviders({
      serviceCategory: document.getElementById("category-filter")?.value || "",
    });
    displayProviders(providers, container);
  } catch (error) {
    container.innerHTML = `<p>Error loading providers: ${error.message}</p>`;
  }
}

// Display providers in grid
function displayProviders(providers, container) {
  if (!providers || providers.length === 0) {
    container.innerHTML = "<p>No providers found in your area.</p>";
    return;
  }

  container.innerHTML = providers
    .map(
      (provider) => `
    <div class="provider-card">
      <div class="provider-header">
        <h3>${provider.userId.name}</h3>
        <span class="rating">⭐ ${roundRating(provider.rating)}</span>
      </div>
      <p class="category">${provider.serviceCategory}</p>
      <p class="bio">${provider.bio || "No bio"}</p>
      <div class="provider-info">
        <p><strong>Experience:</strong> ${provider.experience} years</p>
        <p><strong>Rate:</strong> ₹${provider.hourlyRate}/hr</p>
        <p><strong>Reviews:</strong> ${provider.totalReviews}</p>
      </div>
      <div class="provider-contact">
        <p><strong>Phone:</strong> ${provider.userId.phone}</p>
        <p><strong>City:</strong> ${
        provider.userId.city || "Not specified"
      }</p>
      </div>
      <button class="btn-book" onclick="viewProvider('${provider._id}')">View Profile</button>
    </div>
  `
    )
    .join("");
}

// Filter providers by category
async function filterByCategory() {
  const category = document.getElementById("category-filter")?.value;
  const container = document.getElementById("providers-list") || 
                   document.querySelector(".providers-grid");

  if (!container) return;

  try {
    const providers = await getAllProviders({
      serviceCategory: category || "",
    });
    displayProviders(providers, container);
  } catch (error) {
    console.error("Filter error:", error);
  }
}

// View provider profile
function viewProvider(providerId) {
  window.location.href = `provider_profile.html?id=${providerId}`;
}

// Search providers
async function searchProviders(query) {
  const container = document.getElementById("providers-list") || 
                   document.querySelector(".providers-grid");
  
  if (!container) return;

  try {
    const allProviders = await getAllProviders();
    const filtered = allProviders.filter(
      (p) =>
        p.userId.name.toLowerCase().includes(query.toLowerCase()) ||
        p.serviceCategory.toLowerCase().includes(query.toLowerCase())
    );
    displayProviders(filtered, container);
  } catch (error) {
    console.error("Search error:", error);
  }
}
