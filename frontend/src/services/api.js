const BASE_URL = "http://localhost:3000";

const post = async (endpoint, body) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${endpoint}`);
  return res.json();
};

export const generateResponse = (body) => post("generate", body);

export const searchCode = (body) => post("search-code", body);

export const searchDocs = (body) => post("search-docs", body);

export const generateSvg = (prompt) => post("generate-svg", { prompt });

export const clearChat = async (conversationId) => {
  const res = await fetch(`${BASE_URL}/clear-chat/${conversationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear chat");
  return res.json();
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("document", file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
};

export const processImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE_URL}/process-image`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to process image");
  return res.json();
};
