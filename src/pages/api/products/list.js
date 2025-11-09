import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const jsonData = fs.readFileSync(filePath);
  let products = JSON.parse(jsonData);

  if (req.method === "GET") {
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.pageSize || "10");

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedProducts = products.slice(startIndex, endIndex);

    res.status(200).json({
      list: paginatedProducts,
      total: products.length,
    });
  } else if (req.method === "POST") {
    const newProduct = req.body;
    newProduct.id = products.length
      ? Math.max(...products.map((p) => p.id)) + 1
      : 1;
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
