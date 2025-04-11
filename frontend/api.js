const API_URL = "http://localhost:8000/api";

async function refreshToken() {
    const refresh = localStorage.getItem("h2ocontrol_refresh_token");
    if (!refresh) {
        throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refresh,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("h2ocontrol_access_token", data.access);
    return data.access;
}

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("h2ocontrol_access_token");
    
    if (!options.headers) {
        options.headers = {};
    }

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    options.headers["Content-Type"] = "application/json";

    try {
        let response = await fetch(`${API_URL}${endpoint}`, options);

        // If token expired, try to refresh it
        if (response.status === 401) {
            try {
                const newToken = await refreshToken();
                options.headers["Authorization"] = `Bearer ${newToken}`;
                response = await fetch(`${API_URL}${endpoint}`, options);
            } catch (error) {
                // If refresh fails, redirect to login
                localStorage.clear();
                window.location.href = "login.html?session_expired=true";
                throw new Error("Session expired");
            }
        }

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
}

// Export the API functions
window.api = {
    get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
    post: (endpoint, data) => apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    }),
    put: (endpoint, data) => apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
}; 