import api from "./api";

// UPLOAD SINGLE FILE
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// UPLOAD MULTIPLE FILES
export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append("files", file);
  });

  const res = await api.post("/upload/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};