// src/pages/transfers/index.tsx
'use client';

import TransferForm from './components/TransferForm';
import TransferHistory from './components/TransferHistory';
import axios from '@/libs/axios';
import { useState } from 'react';
import { Typography, Snackbar, Alert, Box, Stack, Pagination } from '@mui/material';
import { Layout } from '@/components/Layout';
import { appConfig } from '@/constants/app';
import { usePagination } from '@/hooks/usePagination';

export default function TransfersPage({ warehouses, products }) {
  const {
    data: transferHistory,
    total ,
    page,
    pageSize,
    loading,
    error,
    setPage,
    refetch,
  } = usePagination({ apiUrl: '/transfers', pageSize: 5 });
  const [successToast, setSuccessToast] = useState(false);

  const handleTransfer = async (data) => {
    try {
        await axios.post('/transfers', data);
      refetch(); // reload current page after adding
      setSuccessToast(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout pageTitle="Stock Transfers">
      <TransferForm   warehouses={warehouses} 
        products={products} 
        error={error} 
        onSubmit={handleTransfer}  
      />
      <TransferHistory loading={loading} transfers={transferHistory} />
      <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Stack>
      <Snackbar
        open={successToast}
        autoHideDuration={3000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessToast(false)} severity="success">
          Transfer completed successfully!
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export async function getServerSideProps() {
  const baseUrl = appConfig.baseUrl;
  const [warehousesRes, productsRes, transfersRes] = await Promise.all([
    axios.get(`${baseUrl}/api/warehouses`),
    axios.get(`${baseUrl}/api/products`),
    axios.get(`${baseUrl}/api/transfers`),
  ]);
  return {
    props: {
      warehouses: warehousesRes.data,
      products: productsRes.data,
      initialTransfers: transfersRes.data,
    },
  };
}
