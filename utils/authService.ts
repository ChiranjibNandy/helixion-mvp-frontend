import { loginAPI, registerAPI } from '@/lib/auth';
import { setToken } from '@/utils/token';

export const loginUser = async (data: any) => {
  const res = await loginAPI(data);

  if (res.data.success) {
    setToken(res.data.accessToken);
  }

  return res.data;
};

export const registerUser = async (data: any) => {
  const res = await registerAPI(data);
  return res.data;
};