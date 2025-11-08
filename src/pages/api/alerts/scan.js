import { scanAndGenerateAlerts } from "@/libs/alerts";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const alerts = scanAndGenerateAlerts({ keepExistingNotes: true });
    return res.status(200).json({ alerts, message: "Scan complete" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Scan failed", details: err.message });
  }
}
