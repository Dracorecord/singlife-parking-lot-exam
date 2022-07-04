import { publicClient } from ".";

export const getSlots = async () => {
  try {
    return await publicClient({
      url: "/slots",
      method: "get",
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const addSlot = async (data) => {
  try {
    return await publicClient({
      url: "/slots",
      method: "post",
      data,
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const updateSlot = async (id, data) => {
  try {
    return await publicClient({
      url: `/slots/${id}`,
      method: "patch",
      data,
    });
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};
