/**
 * NEUX FRONTEND API ENGINE v1.0
 * -----------------------------
 * Description: Hyper-Advanced Axios Wrapper.
 * Features: Silent Token Refresh, Request Interceptors, Distributed Logging.
 */

import axios from 'axios';

// العنوان الرئيسي للسيرفر (Distributed API Gateway)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1/";

const axiosEngine = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // وقت الانتظار قبل اعتبار الطلب فاشل (15 ثانية)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// ==============================================================================
// 1. REQUEST INTERCEPTOR (قبل إرسال الطلب)
// ==============================================================================
axiosEngine.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 [API Request] ${config.method.toUpperCase()}: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==============================================================================
// 2. RESPONSE INTERCEPTOR (عند استقبال الرد)
// ==============================================================================
axiosEngine.interceptors.response.use(
    (response) => {
        console.log(`✅ [API Success] ${response.status}: ${response.config.url}`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // حالة انتهاء التوكن (Status 401) - محاولة التجديد بصمت (Silent Refresh)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn("🔑 Token expired, attempting silent refresh...");

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post(`${API_BASE_URL}token/refresh/`, {
                    refresh: refreshToken
                });

                if (res.status === 200) {
                    const newAccessToken = res.data.access;
                    localStorage.setItem('accessToken', newAccessToken);
                    
                    // إعادة إرسال الطلب الأصلي بالتوكن الجديد
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosEngine(originalRequest);
                }
            } catch (refreshError) {
                console.error("🚫 Refresh token failed, logging out user...");
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // معالجة الأخطاء العامة (Global Error Handler)
        const errorMessage = error.response?.data?.detail || "Something went wrong on the server.";
        console.error(`❌ [API Error] ${error.response?.status}: ${errorMessage}`);
        
        return Promise.reject(error);
    }
);

export default axiosEngine;