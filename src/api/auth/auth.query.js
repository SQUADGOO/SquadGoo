import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginUser, register, logout } from './auth.api';
import { login as loginAction, logout as logoutAction } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';

export const useLogin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      dispatch(loginAction(res));
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Invalid email or password';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      dispatch(loginAction(res));
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Registration failed';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      dispatch(logoutAction());
    },
  });
};
