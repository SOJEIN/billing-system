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
      PaperProps={{ sx: { borderRadius: 2 } }}
      aria-labelledby="invoice-details-title"
      aria-describedby="invoice-details-description"
    >
      <DialogTitle
        id="invoice-details-title"
        sx={{ backgroundColor: "#1565c0", color: "white" }}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Detalles de la factura
            </Typography>
          </Box>
          {meta ? (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {`#${meta.id ?? ""} - ${meta.client_name ?? ""}`}
              {meta.client_email ? ` — ${meta.client_email}` : ""}
            </Typography>
          ) : null}
        </Box>
      </DialogTitle>
      <DialogContent
        id="invoice-details-description"
        sx={{ px: { xs: 2, md: 3 }, py: { xs: 1, md: 2 } }}
      >
        {details.length === 0 ? (
          <Box mt={2}>
            <Typography>No hay detalles para esta factura</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 0, overflow: "auto", maxHeight: "50vh" }}
          >
            <Table stickyHeader sx={{ width: "100%" }}>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", py: 1.25 }}
                  >
                    Código
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Producto
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Precio unitario
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Cantidad
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    IVA
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Subtotal
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", py: 1.25 }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#f1f8ff" : "white",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <TableCell sx={{ py: 1.25 }}>{item.item_code}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.item_name}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.unit_price}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.quantity}</TableCell>
                    <TableCell>
                      {item.applies_tax ? item.tax_amount : "0.00"}
                    </TableCell>
                    <TableCell sx={{ py: 1.25 }}>{item.subtotal}</TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1565c0", py: 1.25 }}
                    >
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", gap: 1, pr: 2, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
