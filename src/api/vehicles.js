import { publicClient } from ".";

export const getVehicles = async () => {
  try {
    return await publicClient({
      url: "/vehicles",
      method: "get",
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const addVehicle = async (data) => {
  try {
    return await publicClient({
      url: "/vehicles",
      method: "post",
      data,
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateVehicle = async (id, data) => {
  try {
    return await publicClient({
      url: `/vehicles/${id}`,
      method: "patch",
      data,
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};
