import axios from "axios";

const api = axios.create({
  baseURL: "https://gallant-manifestation-production-e9e8.up.railway.app/api", // URL Spring Boot Backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
