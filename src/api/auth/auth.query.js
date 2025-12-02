import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, register, logout, getCurrentUser, updateJobSeekerProfile, verifyEmail, updateProfile } from './auth.api';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearAuth, login, updateUserFields } from '@/store/authSlice';
import { store } from '@/store/store';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { useGetUserData } from '../user/user.query';

export const useLogin = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
        console.log('resss', res)
        dispatch(login(res?.data));
            // dispatch(setToken(res?.token));
    },
  });
};

export const useRegister = () => useMutation({ mutationFn: register });

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (res) => {
      console.log('Email verified successfully', res);
      showToast('Email verified successfully', 'Success', toastTypes.success);
      return res;
    },
    onError: (err) => {
      console.log('Email verification error ::: ', err?.response?.data?.message);
      showToast(err?.response?.data?.message || 'Something went wrong', 'Error', toastTypes.error);
      return err;
    },
  });
}

export const useUpdateProfile = () => {
  const getUserDataMutation = useGetUserData();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (res) => {
      console.log('Profile updated successfully', res);
      await getUserDataMutation.mutateAsync();
      // if(res?.user) {
      //   store?.dispatch(setUser(res?.user));
      //   showToast('Profile updated successfully', 'Success', toastTypes.success)
      // }
      return res
    },
    onError: (err) => {
      console.log('updateProfile error ::: ', err)
      showToast(err || 'Something went wrong', 'Error', toastTypes.error);
      return err
    },
  });
}


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
