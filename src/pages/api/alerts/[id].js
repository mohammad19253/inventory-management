import { readAlerts, saveAlerts } from "@/libs/alerts";

export default function handler(req, res) {
  const { id } = req.query;
  const alerts = readAlerts();
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  if (req.method === "PUT") {
    const payload = req.body || {};
    const updated = {
      ...alerts[idx],
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    if (payload.actions) {
      updated.actions = (alerts[idx].actions || []).concat(payload.actions);
    }

    alerts[idx] = updated;
    saveAlerts(alerts);
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    alerts.splice(idx, 1);
    saveAlerts(alerts);
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
