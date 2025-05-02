import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Adjust if your backend is running on another port

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Ensure the backend is ready to accept JSON
  },
});

// Request interceptor to add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    // Handle any error before request is sent
    console.error("Request error", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and global errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, return the response
    return response;
  },
  (error) => {
    // If an error occurs, handle it
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 403) {
        console.error('Forbidden - Access Denied:', message);
        // You can redirect to a login page or show an alert based on the status code
      }

      if (status === 401) {
        console.error('Unauthorized - Invalid or Expired Token');
        // You might want to redirect the user to the login page for re-authentication
        // or remove the token from localStorage.
        localStorage.removeItem('token');
        // Optionally, redirect to login
      }

      if (status >= 500) {
        console.error('Server Error:', message);
        // Handle server error appropriately
      }

      // Return a rejected promise with the error to be handled in the calling function
      return Promise.reject(error);
    }

    // In case of network errors or others, log and reject
    console.error("Network error or something went wrong", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
