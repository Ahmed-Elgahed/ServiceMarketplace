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
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/users/token/refresh/",
          { refresh }
        );

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);
        setToken(newAccess);

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);