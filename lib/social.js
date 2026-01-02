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

// DELETE POST
export const deletePost = async (postId) => {
  const res = await api.delete(`/social/posts/${postId}`);
  return res.data;
};
