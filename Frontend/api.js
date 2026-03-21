// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// ============================================
// STORAGE & AUTHENTICATION
// ============================================

// Get stored token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Get stored user from localStorage
function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Set auth token and user in localStorage
function setAuthData(token, user) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Clear auth data (logout)
function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}

// ============================================
// API UTILITY FUNCTIONS
// ============================================

// Make API call with token
async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add token to headers if available
  const token = getAuthToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`📤 API Call: ${method} ${endpoint}`, body ? { body } : "");

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    let data;
    
    try {
      data = await response.json();
    } catch (e) {
      data = { message: "Invalid JSON response" };
    }

    console.log(`📥 Response Status: ${response.status}`, data);

    if (!response.ok) {
      // Check if token expired
      if (response.status === 401) {
        clearAuthData();
        window.location.href = "login.html";
      }
      const errorMsg = data.message || `HTTP ${response.status}: API Error`;
      console.error(`❌ API Error: ${errorMsg}`, data);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`❌ API Call Failed: ${endpoint}`, error.message);
    throw error;
  }
}

// ============================================
// AUTH FUNCTIONS
// ============================================

// Register user
async function registerUser(userData) {
  try {
    const response = await apiCall("/auth/register", "POST", userData);
    setAuthData(response.token, response.user);
    return response;
  } catch (error) {
    throw error;
  }
}

// Verify OTP
async function verifyUserOTP(email, otp, userData) {
  try {
    const response = await apiCall("/auth/verify-otp", "POST", {
      email,
      otp,
      userData,
    });
    setAuthData(response.token, response.user);
    return response;
  } catch (error) {
    throw error;
  }
}

// Login user
async function loginUser(email, password) {
  try {
    const response = await apiCall("/auth/login", "POST", {
      email,
      password,
    });
    setAuthData(response.token, response.user);
    return response;
  } catch (error) {
    throw error;
  }
}

// Get current user
async function getCurrentUser() {
  try {
    const response = await apiCall("/auth/me", "GET");
    return response.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Logout
function logout() {
  clearAuthData();
  window.location.href = "index.html";
}

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

// Get user profile
async function getUserProfile() {
  try {
    const response = await apiCall("/users/profile", "GET");
    return response.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Update user profile
async function updateUserProfile(profileData) {
  try {
    console.log("🔌 API: Updating user profile", profileData);
    console.log("🔑 Auth Token:", getAuthToken() ? "✅ Present" : "❌ Missing");
    
    const response = await apiCall("/users/profile", "PUT", profileData);
    
    console.log("✅ Update response received:", response);
    setAuthData(getAuthToken(), response.user);
    return response;
  } catch (error) {
    console.error("❌ API Error in updateUserProfile:", error.message);
    console.error("📋 Full error:", error);
    throw error;
  }
}

// Get all users (admin)
async function getAllUsers() {
  try {
    const response = await apiCall("/users/all", "GET");
    return response.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Delete user (admin)
async function deleteUser(userId) {
  try {
    const response = await apiCall(`/users/${userId}`, "DELETE");
    return response;
  } catch (error) {
    throw error;
  }
}

// ============================================
// PROVIDER FUNCTIONS
// ============================================

// Create provider profile
async function createProviderProfile(providerData) {
  try {
    const response = await apiCall("/providers/create", "POST", providerData);
    return response.provider;
  } catch (error) {
    throw error;
  }
}

// Get provider profile
async function getProviderProfile(providerId) {
  try {
    const response = await apiCall(`/providers/${providerId}`, "GET");
    return response.provider;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return null;
  }
}

// Update provider profile
async function updateProviderProfile(providerData) {
  try {
    const response = await apiCall("/providers/update", "PUT", providerData);
    return response.provider;
  } catch (error) {
    throw error;
  }
}

// Get all providers with filters
async function getAllProviders(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiCall(`/providers?${params}`, "GET");
    return response.providers;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
}

// Get all providers for admin (no filtering, unverified included)
async function getAllProvidersAdmin() {
  try {
    const response = await apiCall("/providers/admin/all", "GET");
    return response.providers;
  } catch (error) {
    console.error("Error fetching providers for admin:", error);
    return [];
  }
}

// Get nearby providers
async function getNearbyProviders(latitude, longitude, serviceCategory = null, distance = 10) {
  try {
    const body = {
      latitude,
      longitude,
      serviceCategory,
      distance,
    };
    const response = await apiCall("/providers/nearby", "POST", body);
    return response.providers;
  } catch (error) {
    console.error("Error finding nearby providers:", error);
    return [];
  }
}

// Delete provider (admin)
async function deleteProvider(providerId) {
  try {
    const response = await apiCall(`/providers/${providerId}`, "DELETE");
    return response;
  } catch (error) {
    throw error;
  }
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

// Show message
function showMessage(elementId, message, type = "info") {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.style.display = "block";
    setTimeout(() => {
      messageEl.style.display = "none";
    }, 5000);
  }
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Format time
function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString();
}

// Round rating
function roundRating(rating) {
  return Math.round(rating * 10) / 10;
}
