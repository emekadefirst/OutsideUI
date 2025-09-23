import apiCall from "./config";


export async function AllEvent() {
    return apiCall("/events/")
}