const API = import.meta.env.VITE_API;

export default async function UploadFile(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file); // single file

  try {
    const response = await fetch(`${API}/files/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log(data)
    return data; // uploaded file info
  } catch (error) {
    throw error;
  }
}
