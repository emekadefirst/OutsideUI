import apiCall from "./config";


export async function userListService() {
    return await apiCall("/users/",)
}