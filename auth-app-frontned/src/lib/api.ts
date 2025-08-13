const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,
  googleAuth: `${API_BASE_URL}/auth/google`,
  completeProfile: `${API_BASE_URL}/auth/complete-profile`,

  // User endpoints
  profile: `${API_BASE_URL}/users/profile`,
  updateProfile: `${API_BASE_URL}/users/profile`,
  changePassword: `${API_BASE_URL}/users/change-password`,
  allUsers: `${API_BASE_URL}/users`,
  userById: (id: string) => `${API_BASE_URL}/users/${id}`,

  // Helper function to make API calls
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log("API Request:", { endpoint, config });

    const response = await fetch(endpoint, config);

    console.log("API Response:", { status: response.status, ok: response.ok });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        throw new Error("Unauthorized");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Data:", data);

    return data;
  },
};
