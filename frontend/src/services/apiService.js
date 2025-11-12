import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const originalRequest = error.config;

    if (response) {
      if (response.status === 401 && !originalRequest.url.includes("/auth/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.warning("Sessão expirada. Faça login novamente.");
        window.location.href = "/login";
      } else if (response.status >= 400 && response.status < 500) {
        console.warn("Erro de cliente:", response.data?.error || response.statusText);
      } else if (response.status >= 500) {
        console.error("Erro no servidor:", response.data?.error || response.statusText);
        toast.error("Erro interno no servidor. Tente novamente mais tarde.");
      }
    } else {
      console.error("Erro de rede:", error.message);
      toast.error("Erro de rede. Verifique sua conexão com a internet.");
    }

    return Promise.reject(error);
  }
);

export default api;
