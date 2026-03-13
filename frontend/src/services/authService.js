import axios from 'axios';

// هذا هو الرابط الذي سيتحدث معه الفرونت اند (السيرفر بتاعك)
const API_URL = "http://127.0.0.1:8000/api/";

const authService = {
  async login(username, password) {
    const response = await axios.post(`${API_URL}token/`, { username, password });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      // ضبط التوكن لكل الطلبات القادمة تلقائياً
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    return response.data;
  }
};

export default authService;