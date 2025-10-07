import apiCall from "./config";
import { toast } from "react-toastify";

export async function getTicketByEvent(id) {
    try {
        const response = await apiCall(`tickets/event/${id}`, "GET");
        console.log(response.data)
        return response.data;
    } catch (error) {
        if (error.statusCode === 404) {
            toast.error("Tickets not found");
        } else {
            toast.error("Failed to load event events details");
        }
        throw error;
    }
}



export async function CreateTickets(data) {
    try {
        const response = await apiCall("tickets/ ", "POST", data);
        if (response.code === 201) {
            toast.success("Event tickets created successfully")
        } else {
            toast.error("Failed to create")
            console.log("Bad request", response.data)
        }
    } catch (error) {
        toast.error("Unknown error")
        console.log("Unknown error", error)
    }
}