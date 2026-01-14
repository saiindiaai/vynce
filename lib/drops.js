import api from "./api";

// FETCH DROP FEED
export const fetchDropFeed = async ({ cursor, limit = 10, feedType = 'global' } = {}) => {
  const res = await api.get('/social/drops/feed', {
    params: { cursor, limit, feedType }
  });
  return res.data;
};

// CREATE DROP COMMENT
export const createDropComment = async (dropId, content, parentCommentId = null) => {
  const data = { content };
  if (parentCommentId) {
    data.parentCommentId = parentCommentId;
  }
  const res = await api.post(
    `/social/drops/${dropId}/comments`,
    data
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

// LIKE DROP COMMENT
export const likeDropComment = async (commentId) => {
  const res = await api.post(`/social/drops/comments/${commentId}/like`);
  return res.data;
};

// DISLIKE DROP COMMENT
export const dislikeDropComment = async (commentId) => {
  const res = await api.post(`/social/drops/comments/${commentId}/dislike`);
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

// TOGGLE BOOKMARK / SAVE DROP
export const toggleBookmark = async (dropId) => {
  const res = await api.post(`/social/drops/${dropId}/bookmark`);
  return res.data;
};

// GET SAVED DROPS (BOOKMARKS)
export const fetchSavedDrops = async (page = 1, limit = 20) => {
  const res = await api.get('/social/drops/saved', {
    params: { page, limit }
  });
  return res.data;
};