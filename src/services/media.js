import apiCall from "./config";


export default async function (formdata) {
    return apiCall("media/", "POST", formdata)
}

