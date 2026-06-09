import API from "./api";

/*
==================================================
RECEIVE GOODS (STORE CLERK)
==================================================
POST /api/inventory/receive/:id
*/
export const receiveGoods = (requisitionId) => {
  return API.post(`/inventory/receive/${requisitionId}`);
};

/*
==================================================
GET ALL INVENTORY (ADMIN / STORE)
==================================================
GET /api/inventory
*/
export const getAllInventory = () => {
  return API.get("/inventory");
};

/*
==================================================
GET DEPARTMENT INVENTORY
==================================================
GET /api/inventory/department/:departmentId
*/
export const getDepartmentInventory = (departmentId) => {
  return API.get(`/inventory/department/${departmentId}`);
};

/*
==================================================
GET INVENTORY ITEM BY ASSET TAG
==================================================
GET /api/inventory/tag/:assetTag
*/
export const getInventoryByTag = (assetTag) => {
  return API.get(`/inventory/tag/${assetTag}`);
};

/*
==================================================
UPDATE INVENTORY STATUS
==================================================
PATCH /api/inventory/status/:id
*/
export const updateInventoryStatus = (id, status) => {
  return API.patch(`/inventory/status/${id}`, { status });
};