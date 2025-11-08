import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
   const { page = 1, pageSize = 20 } = req.query;
  const start = (page - 1) * pageSize;
  const end = start + Number(pageSize);
  const transfersPath = path.join(process.cwd(), 'data', 'transfers.json');
  const stockPath = path.join(process.cwd(), 'data', 'stock.json');
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const warehousesPath = path.join(process.cwd(), 'data', 'warehouses.json');

  const transfers = JSON.parse(fs.readFileSync(transfersPath));
  const stock = JSON.parse(fs.readFileSync(stockPath));
  const products = JSON.parse(fs.readFileSync(productsPath));
  const warehouses = JSON.parse(fs.readFileSync(warehousesPath));

  if (req.method === 'GET') {
     const transfersData  = transfers.map((t ,i) => {
      const product = products.find(p => p.id === t.productId);
      const fromWarehouse = warehouses.find(w => w.id === t.fromWarehouseId);
      const toWarehouse = warehouses.find(w => w.id === t.toWarehouseId);

      return {
        ...t,
        index:i+1,
        product: product ? { id: product.id, name: product.name } : null,
        fromWarehouse: fromWarehouse ? { id: fromWarehouse.id, name: fromWarehouse.name } : null,
        toWarehouse: toWarehouse ? { id: toWarehouse.id, name: toWarehouse.name } : null,
      };
    });
    const paginated = transfersData.slice(start, end);
    return res.status(200).json({
      list:paginated,
      total:transfersData.length
    });
  }

  if (req.method === 'POST') {
    const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;

    if (!productId || !fromWarehouseId || !toWarehouseId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (fromWarehouseId === toWarehouseId) {
      return res.status(400).json({ message: 'Source and destination warehouses must differ' });
    }

    const productExists = products.some(p => p.id === productId);
    const fromExists = warehouses.some(w => w.id === fromWarehouseId);
    const toExists = warehouses.some(w => w.id === toWarehouseId);

    if (!productExists || !fromExists || !toExists) {
      return res.status(400).json({ message: 'Invalid product or warehouse IDs' });
    }

    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: 'Quantity must be positive' });

    // Find source stock
    const sourceStock = stock.find(
      s => s.productId === productId && s.warehouseId === fromWarehouseId
    );
    const available = sourceStock ? sourceStock.quantity : 0;

    if (available < qty) {
      return res.status(400).json({ message: `Insufficient stock in source warehouse (available: ${available})` });
    }

 
    if (sourceStock) sourceStock.quantity -= qty;

    
    let destStock = stock.find(
      s => s.productId === productId && s.warehouseId === toWarehouseId
    );
    if (destStock) {
      destStock.quantity += qty;
    } else {
      stock.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        productId,
        warehouseId: toWarehouseId,
        quantity: qty
      });
    }

    // Save stock
    fs.writeFileSync(stockPath, JSON.stringify(stock, null, 2));

    // Save transfer
    const newTransfer = {
      id: Date.now(),
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity: qty,
      date: new Date().toISOString()
    };
    transfers.unshift(newTransfer);
    fs.writeFileSync(transfersPath, JSON.stringify(transfers, null, 2));

    return res.status(201).json(newTransfer);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
