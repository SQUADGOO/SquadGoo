import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/store/authSlice';
import { store } from '@/store/store';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { getUserData } from './user.api';

export const useGetUserData = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: getUserData,
    onSuccess: (res) => {
        // console.log('useGetUserData resss', res?.data?.profile?.basicDetails)
        dispatch(updateUserFields(res?.data?.profile?.basicDetails));
    },
    onError: (err) => {
      console.log('Get user data error ::: ', err)
      return err
    }
  });
};

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
