import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { addFullAddress, addJobPreferences, addSocialLinks, addTaxInfo, addWorkExperience } from './jobSeeker.api';
import { refreshUserData } from '@/utilities/refreshUserData';

export const useAddWorkExperience = () => {
  return useMutation({
    mutationFn: addWorkExperience,
    onSuccess: (res) => {
        console.log('useAddWorkExperience resss', res)
        // dispatch(updateUserFields(res?.data));
    },
    onError: (err) => {
      showToast(err?.response?.data?.error?.message || 'Could not save work experience', 'Error', toastTypes.error);
    }
  });
};

export const useAddFullAddress = () => {
  return useMutation({
    mutationFn: addFullAddress,
    onSuccess: async (res) => {
        // console.log('useAddFullAddress resss', res)
        showToast(res?.message || 'Address added successfully', 'Success', toastTypes.success);
        await refreshUserData();

    },
    onError: (err) => {
      showToast(err?.response?.data?.error?.message || 'Could not save address', 'Error', toastTypes.error);
    }
  });
}

export const useAddTaxInfo = () => {
  return useMutation({
    mutationFn: addTaxInfo,
    onSuccess: async (res) => {
        showToast(res?.message || 'Tax information added successfully', 'Success', toastTypes.success);
        await refreshUserData();
    },
    onError: (err) => {
      showToast(err?.response?.data?.error?.message || 'Could not save tax information', 'Error', toastTypes.error);
    }
  });
}

export const useAddSocialLinks = () => {
  return useMutation({
    mutationFn: addSocialLinks,
    onSuccess: async (res) => {
        showToast(res?.message || 'Social links added successfully', 'Success', toastTypes.success);
        await refreshUserData();
    },
    onError: (err) => {
      showToast(err?.response?.data?.error?.message || 'Could not save social links', 'Error', toastTypes.error);
    }
  });
};

export const useAddJobPreferences = () => {
  return useMutation({
    mutationFn: addJobPreferences,
    onSuccess: async (res) => {
        showToast(res?.message || 'Job preferences added successfully', 'Success', toastTypes.success);
        await refreshUserData();
    },
    onError: (err) => {
      showToast(err?.response?.data?.error?.message || 'Could not save preferences', 'Error', toastTypes.error);
    }
  });
}
