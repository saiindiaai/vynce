import api from "./api";

// FETCH CAPSULE FEED
export const fetchCapsuleFeed = async ({ cursor, limit = 10 } = {}) => {
  const res = await api.get('/social/capsules/feed', {
    params: { cursor, limit }
  });
  return res.data;
};

// CREATE CAPSULE
export const createCapsule = async (content) => {
  const res = await api.post('/social/capsules', { content });
  return res.data;
};

// GET USER CAPSULES
export const fetchUserCapsules = async ({ cursor, limit = 20 } = {}) => {
  const res = await api.get('/social/capsules/user', {
    params: { cursor, limit }
  });
  return res.data;
};

// TOGGLE LIKE / UNLIKE CAPSULE
export const toggleCapsuleLike = async (capsuleId) => {
  const res = await api.post(`/social/capsules/${capsuleId}/like`);
  return res.data;
};

// TOGGLE DISLIKE / UNDISLIKE CAPSULE
export const toggleCapsuleDislike = async (capsuleId) => {
  const res = await api.post(`/social/capsules/${capsuleId}/dislike`);
  return res.data;
};

// SHARE CAPSULE
export const shareCapsule = async (capsuleId) => {
  const res = await api.post(`/social/capsules/${capsuleId}/share`);
  return res.data;
};

// TOGGLE BOOKMARK / SAVE CAPSULE
export const toggleCapsuleBookmark = async (capsuleId) => {
  const res = await api.post(`/social/capsules/${capsuleId}/bookmark`);
  return res.data;
};

// GET SAVED CAPSULES (BOOKMARKS)
export const fetchSavedCapsules = async (page = 1, limit = 20) => {
  const res = await api.get('/social/capsules/saved', {
    params: { page, limit }
  });
  return res.data;
};

// DELETE CAPSULE
export const deleteCapsule = async (capsuleId) => {
  const res = await api.delete(`/social/capsules/${capsuleId}`);
  return res.data;
};