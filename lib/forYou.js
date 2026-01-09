import api from "./api";

export const fetchForYou = async () => {
  const res = await api.get("/social/explore/for-you");
  return res.data;
};
