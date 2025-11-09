import fs from "fs";
import path from "path";

const ordersPath = path.join(process.cwd(), "data", "orders.json");
const productsPath = path.join(process.cwd(), "data", "products.json");

export default function handler(req, res) {
  const { page = 1, pageSize = 20 } = req.query;
  const start = (page - 1) * pageSize;
  const end = start + Number(pageSize);

  const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  const attachProductName = (order) => {
    const product = products.find((p) => p.id === order.productId);
    return { ...order, productName: product ? product.name : "Unknown" };
  };

  if (req.method === "GET") {
    const paginated = orders.slice(start, end).map(attachProductName);
    return res.status(200).json({
      list: paginated,
      total: orders.length,
    });
  }

  if (req.method === "POST") {
    const { productId, qty, status, note } = req.body;

    if (!productId || !qty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = {
      id: Date.now(),
      productId,
      qty,
      status: status || "inprogress",
      note: note || "",
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    fs.writeFileSync(ordersPath, JSON.stringify(updatedOrders, null, 2));

    const responseOrder = attachProductName(newOrder);
    return res.status(201).json(responseOrder);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const updatedData = req.body;

    const updatedOrders = orders.map((order) =>
      order.id === Number(id) ? { ...order, ...updatedData } : order
    );

    fs.writeFileSync(ordersPath, JSON.stringify(updatedOrders, null, 2));

    const updatedOrder = updatedOrders.find((o) => o.id === Number(id));
    return res.status(200).json(attachProductName(updatedOrder));
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const filtered = orders.filter((o) => o.id !== Number(id));
    fs.writeFileSync(ordersPath, JSON.stringify(filtered, null, 2));
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
