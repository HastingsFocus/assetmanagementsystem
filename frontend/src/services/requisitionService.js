import API from "./api";

/*
========================================
REQUISITION API
========================================
*/

export const createRequisition = (data) => {
  return API.post("/requisitions", data);
};

export const getMyRequisitions = () => {
  return API.get("/requisitions/my");
};

export const getAllRequisitions = () => {
  return API.get("/requisitions/all");
};

export const reviewRequisition = (id, data) => {
  return API.put(`/requisitions/${id}/review`, data);
};

export const getRequisitionById = (id) => {
  return API.get(`/requisitions/${id}`);
};

export const getApprovedRequisitions = async () => {
  const response = await API.get("/requisitions/all");
  return response.data;
};