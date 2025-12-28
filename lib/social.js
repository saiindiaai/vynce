import api from "./api";

export const fetchSocialFeed = async ({ cursor = null, limit = 10 }) => {
  const params = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;

  const res = await api.get("/social/posts", { params });
  return res.data;
};
