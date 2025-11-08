import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "products.json");
  const jsonData = fs.readFileSync(filePath);
  let products = JSON.parse(jsonData);

  if (req.method === "GET") {
    const product = products.find((p) => p.id === parseInt(id));
    if (product) {
      res.status(200).json(product);
    } else {
<<<<<<< HEAD
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (req.method === 'PUT') {
=======
      res.status(404).json({ message: "Product not found" });
    }
  } else if (req.method === "PUT") {
>>>>>>> master
    const index = products.findIndex((p) => p.id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body, id: parseInt(id) };
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(200).json(products[index]);
    } else {
<<<<<<< HEAD
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (req.method === 'DELETE') {
=======
      res.status(404).json({ message: "Product not found" });
    }
  } else if (req.method === "DELETE") {
>>>>>>> master
    const index = products.findIndex((p) => p.id === parseInt(id));
    if (index !== -1) {
      products.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      res.status(204).end();
    } else {
<<<<<<< HEAD
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

=======
      res.status(404).json({ message: "Product not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
>>>>>>> master
