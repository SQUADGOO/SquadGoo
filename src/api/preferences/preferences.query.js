import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {showToast, toastTypes} from '@/utilities/toastConfig';
import {
  listPreferences,
  createPreference,
  updatePreference,
  deletePreference,
} from './preferences.api';

export const preferencesKeys = {
  all: ['preferences'],
  list: () => [...preferencesKeys.all, 'list'],
};

export const usePreferences = () =>
  useQuery({queryKey: preferencesKeys.list(), queryFn: listPreferences});

export const useCreatePreference = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPreference,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: preferencesKeys.list()});
      showToast('Preference saved', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not save preference',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useUpdatePreference = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}) => updatePreference(id, data),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: preferencesKeys.list()});
      showToast('Preference updated', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not update preference',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useDeletePreference = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => deletePreference(id),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: preferencesKeys.list()});
      showToast('Preference removed', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not remove preference',
        'Error',
        toastTypes.error,
      ),
  });
};
