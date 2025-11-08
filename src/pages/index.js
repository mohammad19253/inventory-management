 
import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Layout } from '@/components/Layout';
import { SUMMARY_CARDS, TABLE_HEADERS } from '@/constants/dashboard';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/warehouses').then(r => r.json()),
      fetch('/api/stock').then(r => r.json()),
    ]).then(([productsData, warehousesData, stockData]) => {
      setProducts(productsData);
      setWarehouses(warehousesData);
      setStock(stockData);
    });
  }, []);

  const totalValue = stock.reduce((sum, s) => {
    const product = products.find(p => p.id === s.productId);
    return sum + (product ? product.unitCost * s.quantity : 0);
  }, 0);

  const inventoryOverview = products.map(p => {
    const productStock = stock.filter(s => s.productId === p.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    return { ...p, totalQuantity, isLowStock: totalQuantity < p.reorderPoint };
  });

  const CARD_DATA = {
    products: products.length,
    warehouses: warehouses.length,
    totalValue: totalValue.toFixed(2),
  };

  return (
    <Layout pageTitle="Dashboard">
      <Container>
        <Typography variant="h4" gutterBottom>Dashboard</Typography> 
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {SUMMARY_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <Grid item xs={12} sm={4} key={card.label}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Icon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">{card.label}</Typography>
                    </Box>
                    <Typography variant="h3">{CARD_DATA[card.key]}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Typography variant="h5" gutterBottom>Inventory Overview</Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {TABLE_HEADERS.map(header => (
                  <TableCell key={header.key} align={header.align}><strong>{header.label}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryOverview.map(item => (
                <TableRow key={item.id} sx={{ backgroundColor: item.isLowStock ? '#fff3e0' : 'inherit' }}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{item.totalQuantity}</TableCell>
                  <TableCell align="right">{item.reorderPoint}</TableCell>
                  <TableCell>
                    <Typography color={item.isLowStock ? 'warning.main' : 'success.main'} fontWeight={item.isLowStock ? 'bold' : 'normal'}>
                      {item.isLowStock ? 'Low Stock' : 'In Stock'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
}
