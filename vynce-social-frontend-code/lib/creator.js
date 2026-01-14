import api from "./api";

// CREATE CREATOR POST (drop, capsule, fight)
export const createCreatorPost = async (postData) => {
  const res = await api.post("/creator", postData);
  return res.data;
};