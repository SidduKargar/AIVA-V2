import { searchCode, searchDocs } from "../services/codeService.js";

export async function handleSearchCode(req, res) {
  try {
    const response = await searchCode(req.body);
    res.json({ response });
  } catch (error) {
    console.error("Error searching code:", error);
    res.status(500).json({ error: "Failed to search code" });
  }
}

export async function handleSearchDocs(req, res) {
  try {
    const response = await searchDocs(req.body);
    res.json({ response });
  } catch (error) {
    console.error("Error searching documentation:", error);
    res.status(500).json({ error: "Failed to search documentation" });
  }
}
