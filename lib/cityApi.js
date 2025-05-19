export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required as ?city=Seattle" });
  }

  const apiUrl = `https://www.teeoff.com/api/autocomplete/geocity/${encodeURIComponent(
    city
  )}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from teeoff.com" });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching data from teeoff.com" });
  }
}
