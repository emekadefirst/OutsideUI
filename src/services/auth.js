import apiCall from "./config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";  

export async function getUser() {
  try {
    const response = await apiCall("users/whoami", "GET");
    return response.data;
  } catch (err) {
    toast.error("Failed to load user");
    throw err;
  }
}

export async function login(data) {
  try {
    const response = await apiCall("users/login", "POST", data);
    console.log(response.data)

    if (response.status === 200) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      toast.success("Login successful");
      return response.data;
    } else {
      toast.error("Failed to login");
    }
  } catch (err) {
    toast.error("Login error");
    throw err;
  }
}


export function logoutUser() {
  localStorage.clear();
  window.location.href = "/admin"; 
}
