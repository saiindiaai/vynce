import api from "./api";

export const fetchCategories = async () => {
  const res = await api.get("/social/explore/categories");
  return res.data;
};
