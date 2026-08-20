const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://full-stack-0yf4.onrender.com";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Unable to connect to the backend server. Please check your internet connection.");
    }
    throw err;
  }
}

export const authApi = {
  register: (user) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  login: (user) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};

export const postsApi = {
  getAll: () => request("/api/posts"),

  getById: (id) => request(`/api/posts/${id}`),

  create: (post) =>
    request("/api/posts", {
      method: "POST",
      body: JSON.stringify(post),
    }),

  update: (id, post) =>
    request(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    }),

  delete: (id) =>
    request(`/api/posts/${id}`, {
      method: "DELETE",
    }),
};

export const schedulesApi = {
  getAll: () => request("/api/schedules"),

  getById: (id) => request(`/api/schedules/${id}`),

  create: (schedule) =>
    request("/api/schedules", {
      method: "POST",
      body: JSON.stringify(schedule),
    }),

  update: (id, schedule) =>
    request(`/api/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(schedule),
    }),

  delete: (id) =>
    request(`/api/schedules/${id}`, {
      method: "DELETE",
    }),
};
