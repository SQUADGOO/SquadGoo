import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, register, logout, getCurrentUser } from './auth.api';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearAuth, login } from '@/store/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
        console.log('resss', res)
          dispatch(login(res));
            // dispatch(setToken(res?.token));
    },
  });
};

export const useRegister = () => useMutation({ mutationFn: register });
export const useLogout = () => useMutation({ mutationFn: logout });
export const useCurrentUser = () =>
  useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser });
