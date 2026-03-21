// Admin Dashboard Script

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  // Verify admin access
  const user = getStoredUser();
  if (!user || user.role !== "admin") {
    console.warn("⚠️ Access denied. Not an admin.");
    window.location.href = "login.html";
    return;
  }

  console.log("✅ Admin access verified");

  // Load all users and providers
  await loadAdminData();

  // Auto-refresh stats every 10 seconds to show real-time updates
  setInterval(loadAdminData, 10000);
});

// Logout function
function logout() {
  clearAuthData();
  window.location.href = "index.html";
}

// Load all users and providers from backend
async function loadAdminData() {
  console.log("📊 Loading admin data...");

  try {
    // Fetch all users
    const users = await getAllUsers();
    console.log("✅ Users fetched:", users);

    // Fetch all providers (admin version - unfiltered)
    const providers = await getAllProvidersAdmin();
    console.log("✅ Providers fetched:", providers);

    // Separate users and providers
    const userList = users.filter(u => u.role === "user");
    const providerList = providers.length > 0 ? providers : [];

    // Update stats
    updateStats(userList, providerList);

    // Populate tables
    populateUsersTable(userList);
    populateProvidersTable(providerList);

  } catch (error) {
    console.error("❌ Error loading admin data:", error);
    showErrorMessage(error.message);
  }
}

// Update dashboard stats
function updateStats(users, providers) {
  console.log(`📈 Updating stats - Users: ${users.length}, Providers: ${providers.length}`);

  const stats = document.querySelectorAll(".stat-num");
  if (stats.length >= 2) {
    stats[0].textContent = users.length;
    stats[1].textContent = providers.length;
    // Keep other stats as is (bookings and revenue are static)
  }
}

// Populate users table
function populateUsersTable(users) {
  const tbody = document.getElementById("users-tbody");
  
  if (!tbody) {
    console.warn("⚠️ Users table body not found");
    return;
  }

  if (!users || users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#607080;">No users registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => {
    const userStatus = user.status || "active";
    const isBlocked = userStatus === "blocked";
    const badge = isBlocked 
      ? '<span class="badge badge-inactive">Blocked</span>'
      : '<span class="badge badge-active">Active</span>';
    const btnText = isBlocked ? "Unblock" : "Block";
    const btnClass = isBlocked ? "btn-approve" : "btn-block";

    return `<tr>
      <td>${user.name || "N/A"}</td>
      <td>${user.email || "N/A"}</td>
      <td>${badge}</td>
      <td><button class="${btnClass}" onclick="toggleUserBlock('${user._id}', '${userStatus}')"> ${btnText}</button></td>
    </tr>`;
  }).join("");

  console.log("✅ Users table populated");
}

// Populate providers table
function populateProvidersTable(providers) {
  const tbody = document.getElementById("providers-tbody");
  
  if (!tbody) {
    console.warn("⚠️ Providers table body not found");
    return;
  }

  if (!providers || providers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#607080;">No providers registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = providers.map(provider => {
    // Get user data from populated userId field or fallback
    const userName = provider.userId?.name || "N/A";
    const userEmail = provider.userId?.email || "N/A";
    const providerStatus = provider.status || "active";
    const isBlocked = providerStatus === "blocked";
    const badge = isBlocked
      ? '<span class="badge badge-inactive">Blocked</span>'
      : '<span class="badge badge-active">Active</span>';
    const btnText = isBlocked ? "Unblock" : "Block";
    const btnClass = isBlocked ? "btn-approve" : "btn-block";
    const category = provider.serviceCategory || "";
    const rating = provider.rating ? provider.rating.toFixed(1) : "0";

    return `<tr>
      <td>${userName}</td>
      <td>${userEmail}</td>
      <td><span style="font-size:11px;">${category}</span></td>
      <td>⭐ ${rating}</td>
      <td>${badge}</td>
      <td><button class="${btnClass}" onclick="toggleProviderBlock('${provider._id}', '${providerStatus}')"> ${btnText}</button></td>
    </tr>`;
  }).join("");

  console.log("✅ Providers table populated");
}

// Toggle block/unblock user
async function toggleUserBlock(userId, currentStatus) {
  const newStatus = currentStatus === "blocked" ? "active" : "blocked";
  console.log(`🔄 Toggling user ${userId} status to: ${newStatus}`);

  try {
    // Note: This API endpoint may need to be created in the backend
    // For now, we'll reload the data after the toggle attempt
    await apiCall(`/users/${userId}`, "PUT", { status: newStatus });
    console.log("✅ User status updated");
    
    // Reload the data
    await loadAdminData();
  } catch (error) {
    console.error("❌ Error toggling user block status:", error);
    showErrorMessage("Failed to update user status");
  }
}

// Toggle block/unblock provider
async function toggleProviderBlock(providerId, currentStatus) {
  const newStatus = currentStatus === "blocked" ? "active" : "blocked";
  console.log(`🔄 Toggling provider ${providerId} status to: ${newStatus}`);

  try {
    // Note: This API endpoint may need to be created in the backend
    // For now, we'll reload the data after the toggle attempt
    await apiCall(`/providers/${providerId}`, "PUT", { status: newStatus });
    console.log("✅ Provider status updated");
    
    // Reload the data
    await loadAdminData();
  } catch (error) {
    console.error("❌ Error toggling provider block status:", error);
    showErrorMessage("Failed to update provider status");
  }
}

// Show error message
function showErrorMessage(message) {
  console.error(`🚨 Error: ${message}`);
  alert(`Error: ${message}`);
}
