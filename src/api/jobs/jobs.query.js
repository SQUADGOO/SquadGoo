import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {showToast, toastTypes} from '@/utilities/toastConfig';
import {
  createJob,
  listMyJobs,
  getJob,
  updateJobDraft,
  publishJob,
  deleteJob,
  closeJob,
  getJobCandidates,
} from './jobs.api';

export const jobsKeys = {
  all: ['jobs'],
  lists: () => [...jobsKeys.all, 'list'],
  list: status => [...jobsKeys.lists(), status ?? 'all'],
  detail: id => [...jobsKeys.all, 'detail', id],
  candidates: jobId => [...jobsKeys.all, 'candidates', jobId],
};

export const useMyJobs = status =>
  useQuery({
    queryKey: jobsKeys.list(status),
    queryFn: () => listMyJobs(status),
  });

export const useJob = id =>
  useQuery({
    queryKey: jobsKeys.detail(id),
    queryFn: () => getJob(id),
    enabled: !!id,
  });

export const useJobCandidates = jobId =>
  useQuery({
    queryKey: jobsKeys.candidates(jobId),
    queryFn: () => getJobCandidates(jobId),
    enabled: !!jobId,
  });

export const useCreateJob = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => qc.invalidateQueries({queryKey: jobsKeys.lists()}),
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not post job',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useUpdateJobDraft = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}) => updateJobDraft(id, data),
    onSuccess: job => {
      qc.invalidateQueries({queryKey: jobsKeys.lists()});

      if (job?.id) qc.invalidateQueries({queryKey: jobsKeys.detail(job.id)});
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not save draft',
        'Error',
        toastTypes.error,
      ),
  });
};

export const usePublishJob = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => publishJob(id),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: jobsKeys.lists()});
      showToast('Job published', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not publish job',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => deleteJob(id),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: jobsKeys.lists()});
      showToast('Draft deleted', 'Success', toastTypes.success);
    },
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not delete draft',
        'Error',
        toastTypes.error,
      ),
  });
};

export const useCloseJob = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: id => closeJob(id),
    // Success feedback is shown by the screen's own confirmation alert; just refresh here.
    onSuccess: () => qc.invalidateQueries({queryKey: jobsKeys.lists()}),
    onError: err =>
      showToast(
        err?.response?.data?.error?.message || 'Could not close job',
        'Error',
        toastTypes.error,
      ),
  });
};
