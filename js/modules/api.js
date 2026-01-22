const API_BASE_URL = (() => {
  const { hostname, protocol } = window.location;
  if (
    hostname.includes("github.dev") ||
    hostname.includes("githubusercontent.com")
  ) {
    return `${protocol}//${hostname.replace(/-\d+\.app\.github\.dev$/, "")}-3000.app.github.dev`;
  }
  return "http://localhost:3000";
})();

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Erro na requisição");
    }

    return await response.json();
  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
}

export async function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function register(name, email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

export async function resetRequest(email) {
  return apiRequest("/auth/reset-request", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

export async function resetConfirm(token, password) {
  return apiRequest("/auth/reset-confirm", {
    method: "POST",
    body: JSON.stringify({ token, password })
  });
}

export async function getProfile() {
  return apiRequest("/user/profile");
}

export async function updateProfile(data) {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function uploadFile(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Erro ao enviar arquivo");
  }

  return await response.json();
}

export async function listFiles() {
  return apiRequest("/files");
}

export async function getLogs() {
  return apiRequest("/logs");
}

export async function getPlans() {
  return apiRequest("/plans");
}