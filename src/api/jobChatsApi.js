import { request } from './apiClient';

export async function upsertJobChatThread(payload) {
  return request('mobile-app/job-chats/threads', {
    method: 'post',
    body: payload,
  });
}

export async function fetchJobChatThreads() {
  const data = await request('mobile-app/job-chats/threads');
  return Array.isArray(data?.threads) ? data.threads : [];
}

export async function fetchJobChatThread(threadId) {
  return request(`mobile-app/job-chats/threads/${encodeURIComponent(threadId)}`);
}

export async function sendJobChatMessage(threadId, { text, attachments } = {}) {
  return request(`mobile-app/job-chats/threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'post',
    body: { text, attachments },
  });
}

/**
 * Best-effort server thread upsert after local accept (offline-tolerant).
 */
export async function upsertJobChatOnAccept({
  jobId,
  otherUserId,
  jobTitle,
  searchType,
  offerId,
  matchId,
  location,
}) {
  try {
    return await upsertJobChatThread({
      jobId,
      otherUserId,
      jobTitle,
      searchType,
      offerId,
      matchId,
      location,
    });
  } catch (err) {
    if (__DEV__) {
      console.warn('[jobChatsApi] upsert skipped:', err?.response?.data?.message || err.message);
    }
    return null;
  }
}
