import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';

export const SUMMARY_CARDS = [
  { label: 'Total Products', icon: CategoryIcon, key: 'products' },
  { label: 'Warehouses', icon: WarehouseIcon, key: 'warehouses' },
  { label: 'Total Inventory Value', icon: InventoryIcon, key: 'totalValue' },
];

export const TABLE_HEADERS = [
  { label: 'SKU', align: 'left', key: 'sku' },
  { label: 'Product Name', align: 'left', key: 'name' },
  { label: 'Category', align: 'left', key: 'category' },
  { label: 'Total Stock', align: 'right', key: 'totalQuantity' },
  { label: 'Reorder Point', align: 'right', key: 'reorderPoint' },
  { label: 'Status', align: 'left', key: 'status' },
];