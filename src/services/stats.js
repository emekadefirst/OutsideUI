import apiCall from "./config";


export async function userStats() {
    return (await apiCall('users/stats', 'GET')).data
}


