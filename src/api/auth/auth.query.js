import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, register, logout, getCurrentUser, updateJobSeekerProfile } from './auth.api';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearAuth, login, updateUserFields } from '@/store/authSlice';
import { store } from '@/store/store';
import { showToast, toastTypes } from '@/utilities/toastConfig';

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

//job seeker
export const useUpdateJobSeekerProfile = () => {
  return useMutation({
    mutationFn: updateJobSeekerProfile,
    onSuccess: (res) => {
      console.log('resss', res)
      if(res?.jobSeeker) {
        store?.dispatch(updateUserFields(res?.jobSeeker));
        showToast('Profile updated successfully', 'Success', toastTypes.success)
      }
      return res
    },
    onError: (err) => {
      console.log('updateJobSeekerProfile error ::: ', err)
      return err
    },
  });
}
export const useCurrentUser = () =>
  useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser });
