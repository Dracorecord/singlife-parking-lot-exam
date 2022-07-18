import { publicClient } from ".";

export const getSettings = async () => {
  try {
    return await publicClient({
      url: "/settings",
      method: "get",
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const addEntryPoint = async (id, data) => {
  try {
    return await publicClient({
      url: `/settings/${id}`,
      method: "patch",
      data,
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};
