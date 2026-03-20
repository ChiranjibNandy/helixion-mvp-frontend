import API from './api';

export const loginAPI = (data: {
  email: string;
  password: string;
}) => API.post('/login', data);

export const registerAPI = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => API.post('/register', data);