import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "orders.json");

export default function handler(req, res) {
  const orders = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const id = parseInt(req.query.id);

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  // 🟢 Handle GET (return single order)
  if (req.method === "GET") {
    return res.status(200).json(orders[orderIndex]);
  }

  // 🟡 Handle PUT (update)
  if (req.method === "PUT") {
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    return res.status(200).json(orders[orderIndex]);
  }

  // 🔴 Handle DELETE
  if (req.method === "DELETE") {
    const deleted = orders.splice(orderIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    return res.status(200).json(deleted[0]);
  }

  // 🚫 Invalid method
  return res.status(405).json({ message: "Method Not Allowed" });
}
