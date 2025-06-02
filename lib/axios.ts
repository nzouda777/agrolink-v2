import axios from "axios"

// Create an axios instance with a baseURL that points to our data directory
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
