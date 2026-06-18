import API from "./api";

export const getAllAssets = async () => {
  const res = await API.get("/assets");
  return res.data;
};

export const getAssetById = async (assetId) => {
  const res = await API.get(`/assets/${assetId}`);
  return res.data;
};

export const getAssetByTag = async (assetTag) => {
  const res = await API.get(`/assets/tag/${assetTag}`);
  return res.data;
};

export const getDepartmentAssets = async (department) => {
  const res = await API.get(`/assets/department/${department}`);
  return res.data;
};

export const receiveRequisitionAssets = async (requisitionId) => {
  const res = await API.post(`/assets/receive/${requisitionId}`);
  return res.data;
};

export const createManualAssets = async (payload) => {
  const res = await API.post("/assets/manual", payload);
  return res.data;
};

export const updateAssetStatus = async (assetId, payload) => {
  const res = await API.put(`/assets/${assetId}/status`, payload);
  return res.data;
};

export const requestConditionChange = async (assetId, data) => {
  const res = await API.post(
    `/asset-condition-requests/asset/${assetId}`,
    data
  );
  return res.data;
};

export const getConditionRequests = async () => {
  const res = await API.get(
    "/asset-condition-requests"
  );
  return res.data;
};

export const approveConditionRequest = async (id) => {
  const res = await API.put(
    `/asset-condition-requests/${id}/approve`
  );
  return res.data;
};

export const rejectConditionRequest = async (id, data) => {
  const res = await API.put(
    `/asset-condition-requests/${id}/reject`,
    data
  );
 return res.data;
};

export const getArchivedAssets = async () => {
  const res = await API.get(
    "/assets/archived"
  );
  return res.data;
};

export const createTransferRequest = async (payload) => {
    const res = await API.post("/asset-transfers", payload);
    return res.data;
};
export const getMyTransferRequests = async () => {
    const res = await API.get("/asset-transfers/my");
    return res.data;
};

export const getPendingTransferRequests = async () => {
    const res = await API.get("/asset-transfers/pending");
    return res.data;
};

export const approveTransferRequest = async (id) => {
    const res = await API.put(`/asset-transfers/approve/${id}`);
    return res.data;
};

export const rejectTransferRequest = async (id, data) => {
    const res = await API.put(`/asset-transfers/reject/${id}`, data);
    return res.data;
};