import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");
const ALERTS_PATH = path.join(DATA_DIR, "alerts.json");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const STOCKS_PATH = path.join(DATA_DIR, "stock.json");

function readJson(filePath, fallback = null) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function readStockData() {
  return readJson(STOCKS_PATH, []);
}

function readProducts() {
  return readJson(PRODUCTS_PATH, []);
}

function readAlerts() {
  const all = readJson(ALERTS_PATH, []);
  return all || [];
}

function saveAlerts(alerts) {
  writeJson(ALERTS_PATH, alerts);
  return alerts;
}

function computeTotalStockMap(stocks) {
  const map = {};
  for (const s of stocks) {
    const pid = s.productId;
    map[pid] = (map[pid] || 0) + (s.quantity || 0);
  }
  return map;
}

function computeStatus(totalStock, reorderPoint, options = {}) {
  const overstockFactor = options.overstockFactor ?? 0.1;  
  const criticalFactor = options.criticalFactor ?? 0.1;  

  const criticalThreshold = Math.max(
    0,
    Math.floor(reorderPoint * criticalFactor)
  );

  if (totalStock <= criticalThreshold) return "critical";
  if (totalStock < reorderPoint) return "low";
  if (totalStock > reorderPoint * overstockFactor) return "overstocked";
  return "sufficient";
}

export function scanAndGenerateAlerts({ keepExistingNotes = true } = {}) {
  const products = readProducts() || [];
  const stocks = readStockData() || [];
  const totalMap = computeTotalStockMap(stocks);

  const existingAlerts = readAlerts();
  const alertsByProduct = {};
  for (const a of existingAlerts) {
    alertsByProduct[a.productId] = a;
  }

  const generated = [];
  for (const product of products) {
    const productId = product.id;
    const totalStock = totalMap[productId] || 0;
    const reorderPoint = product.reorderPoint ?? 10;
    const reorderQty = product.reorderQty ?? Math.max(10, reorderPoint * 2);
    const status = computeStatus(totalStock, reorderPoint);

    const base = {
      id:
        alertsByProduct[productId]?.id ??
        `alert_${Date.now()}_${uuidv4().slice(0, 6)}`,
      productId,
      productName: product.name ?? productId,
      totalStock,
      reorderPoint,
      reorderQty,
      status,
      lastUpdated: new Date().toISOString(),
      actions: alertsByProduct[productId]?.actions ?? [],
      dismissed: alertsByProduct[productId]?.dismissed ?? false,
      notes: keepExistingNotes ? alertsByProduct[productId]?.notes ?? "" : "",
    };

    generated.push(base);
  }

  saveAlerts(generated);
  return generated;
}

export {
  readJson,
  writeJson,
  readAlerts,
  saveAlerts,
  readProducts,
  readStockData,
  computeStatus,
  computeTotalStockMap,
  ALERTS_PATH,
};
