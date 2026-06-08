import {useMutation, useQuery} from '@tanstack/react-query';
import {showToast, toastTypes} from '@/utilities/toastConfig';
import {getWallet, createTopupIntent} from './wallet.api';

export const walletKeys = {
  all: ['wallet'],
  snapshot: () => [...walletKeys.all, 'snapshot'],
};

export const useWallet = () =>
  useQuery({queryKey: walletKeys.snapshot(), queryFn: getWallet});

export const useTopupIntent = () =>
  useMutation({
    mutationFn: createTopupIntent,
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not start top-up',
        'Error',
        toastTypes.error,
      ),
  });
