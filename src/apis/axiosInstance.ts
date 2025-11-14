import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://133.186.143.54:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
