// frontend/src/api.js
import axios from "axios";

export const getUsersByLocation = async (lat, long, radius) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/getUsersByLocation`,
      {
        params: {
          lat,
          long,
          radius,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting users by location:", error);
  }
};

export const getUserData = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/getUserData/${userId}`
    );
    const userData = response.data;
    console.log("User data:", userData);
    return userData;
  } catch (error) {
    console.error("Error getting user data:", error.message);
    return null;
  }
};
