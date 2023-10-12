import axios from "axios";
import { API_URL } from "./data";

export const fetchModels = async () => {
  const response = await axios.get(API_URL + "/models");
  return response.data;
};
export const addModel = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/models",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadModelImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};
export const deleteModel = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/models/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
