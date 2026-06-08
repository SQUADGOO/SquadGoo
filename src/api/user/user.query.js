import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { getMe, updateMe, uploadProfilePicture } from './user.api';

export const useGetMe = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await getMe();
      if (res?.user) dispatch(updateUserFields(res.user));
      return res?.user ?? null;
    },
  });
};

export const useUpdateMe = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (res) => {
      if (res?.user) {
        dispatch(updateUserFields(res.user));
        showToast('Profile updated', 'Success', toastTypes.success);
      }
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Update failed';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};

export const useUploadProfilePicture = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (res) => {
      if (res?.user) dispatch(updateUserFields(res.user));
      showToast('Profile photo updated', 'Success', toastTypes.success);
    },
    onError: (err) => {
      showToast(err?.message || 'Photo upload failed', 'Error', toastTypes.error);
    },
  });
};

// Keep old name as alias so existing imports don't break during migration
export const useGetUserData = useGetMe;
