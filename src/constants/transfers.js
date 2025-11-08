export const TRANSFER_FIELDS = [
  { label: 'Source Warehouse', key: 'sourceWarehouseId' },
  { label: 'Destination Warehouse', key: 'destinationWarehouseId' },
  { label: 'Product', key: 'productId' },
  { label: 'Quantity', key: 'quantity', type: 'number' },
];

export const TRANSFER_TABLE_HEADERS = [
  { label: 'ID', key: 'id', align: 'center' },
  { label: 'Product', key: 'productName', align: 'center' },
  { label: 'From', key: 'sourceWarehouseName', align: 'center' },
  { label: 'To', key: 'destinationWarehouseName', align: 'center' },
  { label: 'Quantity', key: 'quantity', align: 'center' },
  { label: 'Date', key: 'date', align: 'center' },
];
