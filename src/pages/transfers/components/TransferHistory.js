import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Skeleton } from '@mui/material';
import { format } from 'date-fns';
export default function TransferHistory({ transfers, loading, rowsPerPage = 10 }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell align="right">Quantity</TableCell> 
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton width={20} /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell align="right"><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            : transfers?.map((t) => (
                <TableRow key={t.id}>
                   <TableCell>{t.index}</TableCell>
                  <TableCell>{t.product?.name}</TableCell>
                  <TableCell>{t.fromWarehouse?.name}</TableCell>
                  <TableCell>{t.toWarehouse?.name}</TableCell>
                  <TableCell align="right">{t.quantity}</TableCell>
                  <TableCell>
                    {format(new Date(t.date), 'yyyy/MM/dd HH:mm:ss')}
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
