import { readAlerts, saveAlerts } from "@/libs/alerts";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { summary } = req.query;
    const alerts = readAlerts();
    if (summary === "true") {
      const counts = alerts.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      }, {});
      return res.status(200).json({ counts, total: alerts.length });
    }
    return res.status(200).json(alerts);
  }

  if (req.method === "POST") {
    const payload = req.body;

    if (!payload.productId) {
      return res.status(400).json({ error: "productId required" });
    }
    const alerts = readAlerts();
    const newAlert = {
      id: `alert_${Date.now()}`,
      productId: payload.productId,
      productName: payload.productName || payload.productId,
      totalStock: payload.totalStock ?? 0,
      reorderPoint: payload.reorderPoint ?? 10,
      reorderQty: payload.reorderQty ?? 0,
      status: payload.status ?? "low",
      recommendedOrder: payload.recommendedOrder ?? 0,
      lastUpdated: new Date().toISOString(),
      actions: [],
      dismissed: false,
      notes: payload.notes || "",
    };
    alerts.push(newAlert);
    saveAlerts(alerts);
    return res.status(201).json(newAlert);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
