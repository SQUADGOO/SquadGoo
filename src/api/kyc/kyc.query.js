import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/store/authSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';
import { submitKycKyb, getKycKyb } from './kyc.api';

export const kycKeys = {
  all: ['kyc-kyb'],
  latest: () => [...kycKeys.all, 'latest'],
};

export const useSubmitKycKyb = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: submitKycKyb,
    onSuccess: (res) => {
      // Reflect the new verification state returned by the backend.
      if (res?.user) {
        dispatch(
          updateUserFields({
            kycStatus: res.user.kycStatus,
            kybStatus: res.user.kybStatus,
          }),
        );
      }
      showToast('Verification submitted successfully', 'Success', toastTypes.success);
    },
    onError: (err) => {
      const message = err?.response?.data?.error?.message || 'Submission failed';
      showToast(message, 'Error', toastTypes.error);
    },
  });
};

export const useGetKycKyb = () =>
  useQuery({ queryKey: kycKeys.latest(), queryFn: getKycKyb });
