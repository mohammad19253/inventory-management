import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { page = 1, pageSize = 20 } = req.query;
  const start = (page - 1) * pageSize;
  const end = start + Number(pageSize);

  const stockPath = path.join(process.cwd(), "data", "stock.json");
  const productsPath = path.join(process.cwd(), "data", "products.json");
  const warehousesPath = path.join(process.cwd(), "data", "warehouses.json");

  const stock = JSON.parse(fs.readFileSync(stockPath));
  const products = JSON.parse(fs.readFileSync(productsPath));
  const warehouses = JSON.parse(fs.readFileSync(warehousesPath));

  if (req.method === "GET") {
    const stockData = stock.map((s, i) => {
      const product = products.find((p) => p.id === s.productId);
      const warehouse = warehouses.find((w) => w.id === s.warehouseId);

      return {
        ...s,
        index: i + 1,
        product: product ? { id: product.id, name: product.name } : null,
        warehouse: warehouse
          ? { id: warehouse.id, name: warehouse.name }
          : null,
      };
    });

    const paginated = stockData.slice(start, end);

    return res.status(200).json({
      list: paginated,
      total: stockData.length,
    });
  }

  if (req.method === "POST") {
    const newStock = req.body;
    newStock.id = stock.length ? Math.max(...stock.map((s) => s.id)) + 1 : 1;
    stock.push(newStock);
    fs.writeFileSync(stockPath, JSON.stringify(stock, null, 2));
    return res.status(201).json(newStock);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
