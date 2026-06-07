import API from "./api";

export const releaseFunds = async (id) => {
  const response = await API.put(
    `/accounts/release-funds/${id}`
  );

  return response.data;
};