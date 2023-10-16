import axios from "axios";

import { API_URL } from "./data";

export const fetchCars = async (model) => {
  const response = await axios.get(
    API_URL + "/cars?" + (model !== "" ? "model=" + model : "")
  );
  return response.data;
};

export const getCar = async (id) => {
  const response = await axios.get(API_URL + "/cars/" + id);
  return response.data;
};

export const addCar = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/cars",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadCarImage = async (file) => {
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

export const updateCar = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/cars/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteCar = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/cars/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
