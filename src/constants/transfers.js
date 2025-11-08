export const TRANSFER_FIELDS = [
  { label: 'Source Warehouse', key: 'sourceWarehouseId' },
  { label: 'Destination Warehouse', key: 'destinationWarehouseId' },
  { label: 'Product', key: 'productId' },
  { label: 'Quantity', key: 'quantity', type: 'number' },
];

export const TRANSFER_TABLE_HEADERS = [
  { label: 'ID', key: 'id', align: 'left' },
  { label: 'Product', key: 'productName', align: 'left' },
  { label: 'From', key: 'sourceWarehouseName', align: 'left' },
  { label: 'To', key: 'destinationWarehouseName', align: 'left' },
  { label: 'Quantity', key: 'quantity', align: 'right' },
  { label: 'Date', key: 'date', align: 'left' },
];
