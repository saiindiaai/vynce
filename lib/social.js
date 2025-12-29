/**
 * Fetch social feed.
 * @param {{cursor?: string|null, limit?: number}} options
 * @returns {Promise<any>} 
 */
import api from "./api";

export const fetchSocialFeed = async ({ cursor = null, limit = 10 }) => {
  const params = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;

const res = await api.get("/social/posts/feed", { params });

  return res.data;
};
