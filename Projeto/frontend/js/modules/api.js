// Base da API
export const API_BASE_URL = (() => {
  const { hostname, protocol } = window.location;
  if (
    hostname.includes("github.dev") ||
    hostname.includes("githubusercontent.com")
  ) {
    return `${protocol}//${hostname.replace(
      /-\d+\.app\.github\.dev$/,
      ""
    )}-3000.app.github.dev`;
  }

  return "http://localhost:3000";
})();

// Requisição genérica
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let message = "Erro na requisição";
      try {
        const data = await response.json();
        message = data.error || data.message || message;
      } catch {}
      throw new Error(message);
    }

    // Evita erro em respostas sem corpo
    if (response.status === 204) return null;

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

export async function listFiles() {
  return apiRequest("/files");
}

export async function uploadFile(file, customFilename = null) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não autenticado");

  const formData = new FormData();
  formData.append("file", file, customFilename || file.name);

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    let message = "Erro ao enviar arquivo";
    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export async function getLogs() {
  return apiRequest("/logs");
}
