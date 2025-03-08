import axios from "../axios.config";
import { AuthLoginModel } from "../types/auth.type";

export const login = async (authData: AuthLoginModel) => {
  try {
    const response = await axios.post("/auth/login", {
      username: authData.username,
      password: authData.password,
    });
    return response.data || { message: "No data returned" };
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Login failed");
  }
}