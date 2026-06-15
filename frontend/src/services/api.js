import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true, 
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default API;