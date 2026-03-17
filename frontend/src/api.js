import axios from "axios";

/*
  ✅ Enterprise-ready Axios instance
  ✅ Works with nginx reverse proxy
  ✅ No CORS issues
  ✅ Token auto-refresh logic included
*/

const API = axios.create({
  baseURL: 'http://13.50.173.96/api/v1/users/me/', // Important for nginx proxy
  withCredentials: true,
});
export const sendMessageAPI = async (conversationId, text) => {
  const response = await API.post(`messages/${conversationId}/`, {
    text,
  });
  return response.data;
};
// ================================
// ✅ Attach Access Token Automatically
// ================================

API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

// ================================
// ✅ Auto Refresh Token on 401
// ================================

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "/api/v1/token/refresh/",
          { refresh }
        );

        const newAccess = response.data.access;

        localStorage.setItem("access", newAccess);

        // Update header for future requests
        API.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;