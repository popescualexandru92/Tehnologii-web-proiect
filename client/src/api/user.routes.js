// client/src/api/user.routes.js
import { axiosNoAuth } from "../axios/axiosNoAuth";
import { axiosAuth } from "../axios/axiosAuth";

export const registerUser = async (userData) => {
  try {
    const response = await axiosNoAuth.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return error.response?.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosAuth.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return error.response?.data;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axiosAuth.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return error.response?.data;
  }
};
