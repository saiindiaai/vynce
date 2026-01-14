import api from "./api";

// FETCH SOCIAL FEED
export const fetchSocialFeed = async ({ cursor = null, limit = 10 } = {}) => {
  const res = await api.get('/social/posts/feed', {
    params: { cursor, limit }
  });
  return res.data;
};

// CREATE COMMENT (for posts/other content)
export const createComment = async (postId, content, parentCommentId = null) => {
  const data = { content };
  if (parentCommentId) {
    data.parentCommentId = parentCommentId;
  }
  const res = await api.post(
    `/social/posts/${postId}/comments`,
    data
  );
  return res.data;
};

// CREATE DROP COMMENT (for drops - separate endpoint)
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

// GET COMMENTS FOR POST
export const fetchCommentsByPost = async (postId) => {
  const res = await api.get(
    `/social/posts/${postId}/comments`
  );
  return res.data;
};

// LIKE COMMENT
export const likeComment = async (commentId) => {
  const res = await api.post(`/social/posts/comments/${commentId}/like`);
  return res.data;
};

// DISLIKE COMMENT
export const dislikeComment = async (commentId) => {
  const res = await api.post(`/social/posts/comments/${commentId}/dislike`);
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

// GET SAVED POSTS (BOOKMARKS)
export const fetchSavedPosts = async (page = 1, limit = 20) => {
  const res = await api.get('/social/posts/saved', {
    params: { page, limit }
  });
  return res.data;
};

// GET ALL SAVED ITEMS (UNIFIED)
export const fetchSavedItems = async (page = 1, limit = 20, type = null) => {
  const params = { page, limit };
  if (type) params.type = type;
  const res = await api.get('/social/saved', { params });
  return res.data;
};

// FOLLOW USER
export const followUser = async (targetUserId) => {
  console.log("Attempting to follow user with ID:", targetUserId);
  const res = await api.post('/users/follow', { targetUserId });
  console.log("Follow response:", res.data);
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

// DELETE POST
export const deletePost = async (postId) => {
  const res = await api.delete(`/social/posts/${postId}`);
  return res.data;
};
