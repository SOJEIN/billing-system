import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import type { InvoiceDetail } from "../InvoicesService";
import { styles } from "../style/InvoiceDetailsDialog.styles";

interface Meta {
  id?: number | null;
  client_name?: string | null;
  client_email?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  details: InvoiceDetail[];
  meta?: Meta | null;
}

const InvoiceDetailsDialog: React.FC<Props> = ({
  open,
  onClose,
  details,
  meta,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: styles.dialogPaper }}
      aria-labelledby="invoice-details-title"
      aria-describedby="invoice-details-description"
    >
      <DialogTitle id="invoice-details-title" sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleBox}>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Detalles de la factura
            </Typography>
          </Box>
          {meta ? (
            <Typography variant="body2" sx={styles.metaText}>
              {`#${meta.id ?? ""} - ${meta.client_name ?? ""}`}
              {meta.client_email ? ` — ${meta.client_email}` : ""}
            </Typography>
          ) : null}
        </Box>
      </DialogTitle>

      <DialogContent id="invoice-details-description" sx={styles.dialogContent}>
        {details.length === 0 ? (
          <Box mt={2}>
            <Typography>No hay detalles para esta factura</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table stickyHeader sx={styles.stickyHeader}>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableCellHead}>Código</TableCell>
                  <TableCell sx={styles.tableCellHead}>Producto</TableCell>
                  <TableCell sx={styles.tableCellHead}>
                    Precio unitario
                  </TableCell>
                  <TableCell sx={styles.tableCellHead}>Cantidad</TableCell>
                  <TableCell sx={styles.tableCellHead}>IVA</TableCell>
                  <TableCell sx={styles.tableCellHead}>Subtotal</TableCell>
                  <TableCell sx={styles.tableCellHead}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    sx={
                      idx % 2 === 0 ? styles.tableRowOdd : styles.tableRowEven
                    }
                  >
                    <TableCell sx={{ py: 1.25 }}>{item.item_code}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.item_name}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.unit_price}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.quantity}</TableCell>
                    <TableCell>
                      {item.applies_tax ? item.tax_amount : "0.00"}
                    </TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.subtotal}</TableCell>
                    <TableCell sx={styles.tableCellTotal}>
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
