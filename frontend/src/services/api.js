import axios from "axios";

// ============================
// ✅ AXIOS INSTANCE
// ============================

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1/",
  timeout: 10000,
});

// ============================
// ✅ TOKEN MANAGEMENT
// ============================

export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  setToken(null);
};

export const logoutUser = () => {
  clearTokens();
  window.location.href = "/login";
};

// تحميل التوكن عند بدء التطبيق
const savedToken = localStorage.getItem("access");
if (savedToken) {
  setToken(savedToken);
}

// ============================
// ✅ AUTO REFRESH TOKEN (Improved)
// ============================

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      alert("Server not responding. Please try again later.");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers["Authorization"] =
              `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API.defaults.baseURL}users/token/refresh/`,
          { refresh }
        );

        const newAccess = response.data.access;

        localStorage.setItem("access", newAccess);
        setToken(newAccess);

        onRefreshed(newAccess);
        isRefreshing = false;

        originalRequest.headers["Authorization"] =
          `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================
// ✅ AUTH
// ============================

export const loginUser = async (username, password) => {
  const response = await API.post("users/login/", {
    username,
    password,
  });

  const { access, refresh } = response.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  setToken(access);

  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await API.post("users/register/", {
    username,
    email,
    password,
  });

  return response.data;
};

// ============================
// ✅ POSTS
// ============================

export const getPosts = async (page = 1, cancelToken) => {
  const response = await API.get(`posts/?page=${page}`, {
    cancelToken,
  });
  return response.data;
};

export const createPost = async (imageFile, caption) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("caption", caption);

  const response = await API.post("posts/create/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const likePost = async (postId) => {
  return API.post(`posts/${postId}/like/`);
};

export const addComment = async (postId, text) => {
  return API.post(`posts/${postId}/comment/`, { text });
};

// ============================
// ✅ PROFILE & FOLLOW
// ============================

export const getProfile = async (username) => {
  const response = await API.get(`users/profile/${username}/`);
  return response.data;
};

export const getFollowers = async (username) => {
  const response = await API.get(`users/${username}/followers/`);
  return response.data;
};

export const followUser = async (username) => {
  const response = await API.post(`users/${username}/follow/`);
  return response.data;
};

export const getSuggestedUsers = async () => {
  const response = await API.get("users/suggested/");
  return response.data;
};

// ============================
// ✅ SEARCH
// ============================

export const searchUsers = async (query) => {
  const response = await API.get(`users/search/?q=${query}`);
  return response.data;
};

// ============================
// ✅ STORIES
// ============================

export const uploadStory = async (mediaFile) => {
  const formData = new FormData();
  formData.append("content", mediaFile);

  const response = await API.post("stories/create/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getStories = async () => {
  const response = await API.get("stories/");
  return response.data;
};

// ============================
// ✅ MESSAGES
// ============================

export const getConversations = async () => {
  const response = await API.get("messages/");
  return response.data;
};

export const sendMessageAPI = async (conversationId, text) => {
  return API.post(`messages/${conversationId}/send/`, { text });
};

// ============================
// ✅ NOTIFICATIONS
// ============================

export const getNotifications = async () => {
  const response = await API.get("notifications/");
  return response.data;
};

// ============================
// ✅ PAYMENT SYSTEM
// ============================

export const sendMoney = async (recipient, amount, note) => {
  const response = await API.post("payments/send/", {
    recipient,
    amount,
    note,
  });

  return response.data;
};

export const getTransactions = async () => {
  const response = await API.get("payments/history/");
  return response.data;
};

export const getWallet = async () => {
  const response = await API.get("payments/wallet/");
  return response.data;
};

export default API;