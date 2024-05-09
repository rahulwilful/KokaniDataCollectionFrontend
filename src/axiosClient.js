import axios from "axios";

const axiosClient = axios.create({
  //baseURL: "http://localhost:3001/",
  baseURL: "https://kokanidatacollectionbackend.onrender.com",
});

// Add a request interceptor to set the Authorization header before each request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
