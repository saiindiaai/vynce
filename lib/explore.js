import api from "./api";

export const fetchExploreData = async () => {
  const res = await api.get("/social/explore/main");
  return res.data;
};
