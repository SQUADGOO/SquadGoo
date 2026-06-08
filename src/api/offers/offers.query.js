import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {showToast, toastTypes} from '@/utilities/toastConfig';
import {jobsKeys} from '../jobs/jobs.query';
import {
  sendOffer,
  listSentOffers,
  withdrawOffer,
  listReceivedOffers,
  acceptOffer,
  declineOffer,
} from './offers.api';

export const offersKeys = {
  all: ['offers'],
  sent: status => [...offersKeys.all, 'sent', status ?? 'all'],
  received: status => [...offersKeys.all, 'received', status ?? 'all'],
};

export const useSentOffers = status =>
  useQuery({
    queryKey: offersKeys.sent(status),
    queryFn: () => listSentOffers(status),
  });

export const useReceivedOffers = status =>
  useQuery({
    queryKey: offersKeys.received(status),
    queryFn: () => listReceivedOffers(status),
  });

export const useSendOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: sendOffer,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: offersKeys.all});
      qc.invalidateQueries({queryKey: jobsKeys.lists()}); // job flips to has_applicants
      showToast('Offer sent', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not send offer',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useWithdrawOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => withdrawOffer(id),
    onSuccess: () => qc.invalidateQueries({queryKey: offersKeys.all}),
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not withdraw offer',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useAcceptOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => acceptOffer(id),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: offersKeys.all});
      showToast('Offer accepted', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not accept offer',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useDeclineOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({id, reason}) => declineOffer(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: offersKeys.all});
      showToast('Offer declined', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not decline offer',
        'Error',
        toastTypes.error,
      ),
  });
};
