import apiCall from "./config";


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