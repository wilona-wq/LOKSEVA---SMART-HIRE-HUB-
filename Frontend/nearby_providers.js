// Nearby Providers Page

document.addEventListener("DOMContentLoaded", async () => {
  // Optional: require auth for this page
  // requireAuth();
  
  await loadNearbyProviders();
});

// Load nearby providers
async function loadNearbyProviders() {
  const container = document.getElementById("nearby-providers") || 
                   document.querySelector(".providers-list");
  
  if (!container) {
    console.log("Nearby providers container not found");
    return;
  }

  container.innerHTML = "<p>Loading nearby providers...</p>";

  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const serviceCategory = document.getElementById("category-filter")?.value;
          const distance = document.getElementById("distance-filter")?.value || 10;

          const providers = await getNearbyProviders(
            latitude,
            longitude,
            serviceCategory || null,
            parseInt(distance)
          );

          displayProviders(providers, container);
        },
        () => {
          // Fallback: load all providers
          loadAllProviders(container);
        }
      );
    } else {
      loadAllProviders(container);
    }
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Load all providers (fallback)
async function loadAllProviders(container) {
  try {
    const providers = await getAllProviders();
    displayProviders(providers, container);
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Display providers
function displayProviders(providers, container) {
  if (!providers || providers.length === 0) {
    container.innerHTML = "<p>No providers found.</p>";
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
      <p class="category"><strong>Service:</strong> ${provider.serviceCategory}</p>
      <p class="bio">${provider.bio || "Professional service provider"}</p>
      <div class="provider-details">
        <p><strong>Experience:</strong> ${provider.experience} years</p>
        <p><strong>Rate:</strong> ₹${provider.hourlyRate}/hour</p>
        <p><strong>Reviews:</strong> ${provider.totalReviews}</p>
        <p><strong>Phone:</strong> ${provider.userId.phone}</p>
        ${provider.userId.city ? `<p><strong>City:</strong> ${provider.userId.city}</p>` : ""}
      </div>
      <button class="btn-contact" onclick="viewProfile('${provider._id}')">View Full Profile</button>
    </div>
  `
    )
    .join("");
}

// View provider profile
function viewProfile(providerId) {
  window.location.href = `provider_profile.html?id=${providerId}`;
}

// Filter by category
async function filterByCategory() {
  const container = document.getElementById("nearby-providers") || 
                   document.querySelector(".providers-list");
  const category = document.getElementById("category-filter")?.value;

  if (!container) return;

  container.innerHTML = "<p>Filtering...</p>";

  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const providers = await getNearbyProviders(
            latitude,
            longitude,
            category || null,
            10
          );
          displayProviders(providers, container);
        },
        () => {
          loadAllProviders(container);
        }
      );
    }
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Filter by distance
async function filterByDistance() {
  await loadNearbyProviders();
}

// Search providers
async function searchProviders(query) {
  const container = document.getElementById("nearby-providers") || 
                   document.querySelector(".providers-list");

  if (!query || query.trim() === "") {
    await loadNearbyProviders();
    return;
  }

  try {
    const allProviders = await getAllProviders();
    const filtered = allProviders.filter(
      (p) =>
        p.userId.name.toLowerCase().includes(query.toLowerCase()) ||
        p.serviceCategory.toLowerCase().includes(query.toLowerCase())
    );
    displayProviders(filtered, container);
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
