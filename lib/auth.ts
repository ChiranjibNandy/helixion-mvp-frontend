import API from './api';

export const loginAPI = (data: {
  email: string;
  password: string;
}) => API.post('auth/login', data);

export const registerAPI = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => API.post('auth/register', data);