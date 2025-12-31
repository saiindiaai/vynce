import api from "./api";

// FETCH SOCIAL FEED
export const fetchSocialFeed = async ({ cursor = null, limit = 10 } = {}) => {
  const res = await api.get('/social/feed', {
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
