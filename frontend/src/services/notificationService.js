import API from "./api";

/*
========================================
GET NOTIFICATIONS
========================================
*/
export const getNotifications = async () => {
  const response = await API.get("/notifications");
  return response.data;
};

/*
========================================
MARK AS READ
========================================
*/
export const markNotificationRead = async (id) => {
  const response = await API.put(
    `/notifications/${id}/read`
  );

  return response.data;
};