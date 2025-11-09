import { useState, useEffect } from "react";
import { Snackbar, Alert, Typography, Container, Divider } from "@mui/material";
import axios from "@/services/axios";
import { appConfig } from "@/config/app";
import TransferForm from "./components/TransferForm";
import TransferHistory from "./components/TransferHistory";

export default function TransfersPage({
  warehouses,
  products,
  initialTransfers,
}) {
  const [transferHistory, setTransferHistory] = useState(initialTransfers.list);
  const [total, setTotal] = useState(initialTransfers.total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchTransfers = async (pageNum = page, pageSizeNum = pageSize) => {
    setLoading(true);
    try {
      const res = await axios.get("/transfers", {
        params: { page: pageNum, pageSize: pageSizeNum },
      });
      setTransferHistory(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message || "Failed to fetch transfers");
    } finally {
      setLoading(false);
    }
  };
  const handleTransfer = async (data) => {
    setError("");
    try {
      await axios.post("/transfers", data);
      await fetchTransfers(page, pageSize);
      setSuccessToast(true);
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || "Failed to create transfer");
    }
  };
  useEffect(() => {
    fetchTransfers(page, pageSize);
  }, [page, pageSize]);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Create Transfer
      </Typography>

      <TransferForm
        warehouses={warehouses}
        products={products}
        error={error}
        onSubmit={handleTransfer}
      />

      <Divider sx={{ my: 5 }} />

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
        Transfers History
      </Typography>
      <TransferHistory
        loading={loading}
        transfers={transferHistory}
        page={page}
        pageSize={pageSize}
        totalRows={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <Snackbar
        open={successToast}
        autoHideDuration={3000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessToast(false)} severity="success">
          Transfer completed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export async function getServerSideProps() {
  const [warehousesRes, productsRes, transfersRes] = await Promise.all([
    axios.get(`/warehouses`),
    axios.get(`/products`),
    axios.get(`/transfers?pageSize=5&page=1`),
  ]);

  return {
    props: {
      warehouses: warehousesRes.data,
      products: productsRes.data,
      initialTransfers: transfersRes.data,
    },
  };
}
