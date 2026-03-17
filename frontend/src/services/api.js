import axios from "axios";

/* ======================================================
   ✅ AXIOS INSTANCE
====================================================== */

const API = axios.create({
  baseURL: 'http://13.50.173.96/api/v1/', // ✅ ده الصح
  timeout: 10000,
});

/* ======================================================
   ✅ ATTACH TOKEN TO EVERY REQUEST
====================================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   ✅ TOKEN HELPERS
====================================================== */

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

export const sendMessageAPI = async (conversationId, text) => {
  const response = await API.post(`messages/${conversationId}/`, {
    text,
  });
  return response.data;
};
/* ======================================================
   ✅ AUTO TOKEN RESTORE ON LOAD
====================================================== */

const savedToken = localStorage.getItem("access");
if (savedToken) {
  setToken(savedToken);
}

/* ======================================================
   ✅ AUTO REFRESH TOKEN
====================================================== */

let isRefreshing = false;
let subscribers = [];

const notifySubscribers = (newToken) => {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  subscribers.push(cb);
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Server not responding");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("/api/v1/token/refresh/", {
          refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);
        setToken(newAccess);

        notifySubscribers(newAccess);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        isRefreshing = false;
        logoutUser();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/* ======================================================
   ✅ AUTH
====================================================== */

export const loginUser = async (username, password) => {
  const res = await API.post("users/login/", {
    username,
    password,
  });

  return res.data;
};

export const registerUser = async (username, email, password) => {
  const res = await API.post("users/register/", {
    username,
    email,
    password,
  });

  return res.data;
};

/* ======================================================
   ✅ POSTS
====================================================== */

export const getPosts = async (page = 1) => {
  const res = await API.get(`posts/?page=${page}`);
  return res.data;
};

export const createPost = async (imageFile, caption) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("caption", caption);

  const res = await API.post("posts/create/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const likePost = (postId) =>
  API.post(`posts/${postId}/like/`);

export const addComment = (postId, text) =>
  API.post(`posts/${postId}/comment/`, { text });

/* ======================================================
   ✅ PROFILE
====================================================== */

export const getProfile = async (username) => {
  const res = await API.get(`users/profile/${username}/`);
  return res.data;
};

export const followUser = async (username) => {
  const res = await API.post(`users/${username}/follow/`);
  return res.data;
};

/* ======================================================
   ✅ SEARCH
====================================================== */

export const searchUsers = async (query) => {
  const res = await API.get(`users/search/?q=${query}`);
  return res.data;
};

/* ======================================================
   ✅ PAYMENT
====================================================== */

export const sendMoney = async (recipient, amount, note) => {
  const res = await API.post("payments/send/", {
    recipient,
    amount,
    note,
  });
  return res.data;
};

export const getTransactions = async () => {
  const res = await API.get("payments/history/");
  return res.data;
};

export const getWallet = async () => {
  const res = await API.get("payments/wallet/");
  return res.data;
};

/* ======================================================
   ✅ NOTIFICATIONS
====================================================== */

export const getNotifications = async () => {
  const res = await API.get("notifications/");
  return res.data;
};

export default API;