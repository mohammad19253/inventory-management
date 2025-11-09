import { readAlerts, scanAndGenerateAlerts } from "@/services/alerts";

export default function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Generate alerts first
    scanAndGenerateAlerts({ keepExistingNotes: true });

    const alerts = readAlerts();
    const unreadCount = alerts.filter(
      (a) => !a.dismissed && a.status === "critical"
    ).length;
    return res.status(200).json({ unread: unreadCount });
  } catch (err) {
    console.error("Failed to compute alerts:", err);
    return res.status(500).json({ error: "Failed to compute alerts" });
  }
}
