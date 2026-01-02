import api from "./api";

// FETCH DROP FEED
export const fetchDropFeed = async ({ cursor, limit = 10 } = {}) => {
  const res = await api.get('/social/drops/feed', {
    params: { cursor, limit }
  });
  return res.data;
};

// CREATE DROP COMMENT
export const createDropComment = async (dropId, content) => {
  const res = await api.post(
    `/social/drops/${dropId}/comments`,
    { content }
  );
  return res.data;
};

// GET COMMENTS FOR DROP
export const fetchDropCommentsByDrop = async (dropId) => {
  const res = await api.get(
    `/social/drops/${dropId}/comments`
  );
  return res.data;
};

// TOGGLE LIKE / UNLIKE DROP
export const toggleDropLike = async (dropId) => {
  const res = await api.post(`/social/drops/${dropId}/like`);
  return res.data;
};

// TOGGLE DISLIKE / UNDISLIKE DROP
export const toggleDropDislike = async (dropId) => {
  const res = await api.post(`/social/drops/${dropId}/dislike`);
  return res.data;
};

// SHARE DROP
export const shareDrop = async (dropId) => {
  const res = await api.post(`/social/drops/${dropId}/share`);
  return res.data;
};

// DELETE DROP
export const deleteDrop = async (dropId) => {
  const res = await api.delete(`/social/drops/${dropId}`);
  return res.data;
};