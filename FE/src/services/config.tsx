import axios from 'axios';
export const $axios = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwibWVtYmVyTG9naW5JZCI6InNzYWZ5IiwibWVtYmVyUm9sZSI6IlJPTEVfUkVHSVNURVJFRF9NRU1CRVIiLCJpYXQiOjE3MTYzNTMzMzYsImV4cCI6MTcxNzU2MjkzNn0.1Txtc4m2KKTWSEz6TVFmkt63QP5xQU4a0MF8569WlaM',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};
export const $pose = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_APP_POSE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

export const $auth = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwibWVtYmVyTG9naW5JZCI6InNzYWZ5IiwibWVtYmVyUm9sZSI6IlJPTEVfUkVHSVNURVJFRF9NRU1CRVIiLCJpYXQiOjE3MTYzNTMzMzYsImV4cCI6MTcxNzU2MjkzNn0.1Txtc4m2KKTWSEz6TVFmkt63QP5xQU4a0MF8569WlaM',
    },
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');
    const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwibWVtYmVyTG9naW5JZCI6InNzYWZ5IiwibWVtYmVyUm9sZSI6IlJPTEVfUkVHSVNURVJFRF9NRU1CRVIiLCJpYXQiOjE3MTYzNTMzMzYsImV4cCI6MTcxNzU2MjkzNn0.1Txtc4m2KKTWSEz6TVFmkt63QP5xQU4a0MF8569WlaM'
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });

  return instance;
};
