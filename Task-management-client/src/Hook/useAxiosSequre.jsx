import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextProvider";

const axiosSequre = axios.create({
  baseURL: "http://localhost:5001",
  // baseURL: "https://server-side-seven-beta.vercel.app",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

const useAxiosSequre = () => {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AppContext);

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axiosSequre.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axiosSequre.interceptors.response.use(
      (response) => response,
      async (error) => {
        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          await logoutUser();
          navigate("/", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject interceptors
    return () => {
      axiosSequre.interceptors.request.eject(requestInterceptor);
      axiosSequre.interceptors.response.eject(responseInterceptor);
    };
  }, [logoutUser, navigate]);

  return axiosSequre;
};

export default useAxiosSequre;
