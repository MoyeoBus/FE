import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://moyeobus.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
