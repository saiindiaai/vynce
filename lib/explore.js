import api from "./api";

export const fetchExploreData = async () => {
  const res = await api.get("/social/explore/main");
  return res.data;
};

export const searchExploreContent = async (query, filter = "all") => {
  const res = await api.get("/social/explore/search", {
    params: { q: query, filter }
  });
  return res.data;
};
