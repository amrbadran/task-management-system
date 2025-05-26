const API_BASE_URL = "/api";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const authAPI = {
  login: (username, password) =>
    apiRequest("/auth/login", "POST", { username, password }),
  register: (userData) => apiRequest("/auth/register", "POST", userData),
  getCurrentUser: () => apiRequest("/auth/me"),
  logout: () => apiRequest("/auth/logout", "POST"),
};

export const projectsAPI = {
  getAll: () => apiRequest("/projects"),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (projectData) => apiRequest("/projects", "POST", projectData),
  update: (id, projectData) =>
    apiRequest(`/projects/${id}`, "PUT", projectData),
  delete: (id) => apiRequest(`/projects/${id}`, "DELETE"),
};

export const tasksAPI = {
  getAll: () => apiRequest("/tasks"),
  getById: (id) => apiRequest(`/tasks/${id}`),
  getByProject: (projectId) => apiRequest(`/projects/${projectId}/tasks`),
  create: (taskData) => apiRequest("/tasks", "POST", taskData),
  update: (id, taskData) => apiRequest(`/tasks/${id}`, "PUT", taskData),
  delete: (id) => apiRequest(`/tasks/${id}`, "DELETE"),
};

export const chatAPI = {
  getMessages: (userId) => apiRequest(`/chat/${userId}`),
  sendMessage: (userId, message) =>
    apiRequest(`/chat/${userId}`, "POST", { message }),
};

export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};
