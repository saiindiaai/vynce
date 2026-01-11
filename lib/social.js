import api from "./api";

// FETCH SOCIAL FEED
export const fetchSocialFeed = async ({ cursor = null, limit = 10 } = {}) => {
  const res = await api.get('/social/posts/feed', {
    params: { cursor, limit }
  });
  return res.data;
};

// CREATE COMMENT
export const createComment = async (postId, content) => {
  const res = await api.post(
    `/social/posts/${postId}/comments`,
    { content }
  );
  return res.data;
};

// GET COMMENTS FOR POST
export const fetchCommentsByPost = async (postId) => {
  const res = await api.get(
    `/social/posts/${postId}/comments`
  );
  return res.data;
};

// TOGGLE LIKE / UNLIKE
export const toggleLike = async (postId) => {
  const res = await api.post(`/social/posts/${postId}/like`);
  return res.data;
};

// TOGGLE DISLIKE / UNDISLIKE
export const toggleDislike = async (postId) => {
  const res = await api.post(`/social/posts/${postId}/dislike`);
  return res.data;
};

// SHARE POST
export const sharePost = async (postId) => {
  const res = await api.post(`/social/posts/${postId}/share`);
  return res.data;
};

// TOGGLE BOOKMARK / SAVE POST
export const toggleBookmark = async (postId) => {
  const res = await api.post(`/social/posts/${postId}/bookmark`);
  return res.data;
};

// FOLLOW USER
export const followUser = async (targetUserId) => {
  const res = await api.post('/users/follow', { targetUserId });
  return res.data;
};

// REPORT POST
export const reportPost = async (postId, reason = "Order Violation") => {
  const res = await api.post('/reports', { 
    type: 'post', 
    targetId: postId, 
    reason,
    meta: { targetId: postId }
  });
  return res.data;
};
