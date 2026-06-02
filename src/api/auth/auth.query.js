import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginUser, register, logout, updateVisa, changePassword } from './auth.api';
import { login as loginAction, logout as logoutAction } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { refreshUserData } from '@/utilities/refreshUserData';

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

// Used by the Visa Details screen (saves visa fields to /app/JobSeeker/updateVisa).
export const useUpdateJobSeekerProfile = () => {
  return useMutation({
    mutationFn: updateVisa,
    onSuccess: async (res) => {
      showToast(res?.message || 'Saved successfully', 'Success', toastTypes.success);
      await refreshUserData();
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Update failed';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      showToast(res?.message || 'Password changed successfully', 'Success', toastTypes.success);
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Could not change password';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};
