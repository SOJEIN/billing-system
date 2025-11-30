import React, { useState } from "react";
import { useInvoices } from "./useInvoices";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";

const Invoices: React.FC = () => {
  const { invoices, loading, handleDelete, currentPage, lastPage, goToPage } =
    useInvoices();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [openDialogView, setOpenDialogView] = useState(false);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<any[]>(
    []
  );

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedInvoiceId(id);
    setOpenDialogDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedInvoiceId !== null) {
      await handleDelete(selectedInvoiceId);
      setOpenDialogDelete(false);
      setSnackbarOpen(true);
      setSelectedInvoiceId(null);
    }
  };

  // --- Funciones ver detalles ---
  const handleOpenViewDialog = (details: any[]) => {
    setSelectedInvoiceDetails(details);
    setOpenDialogView(true);
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Cargando facturas...</Typography>
      </Box>
    );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Cliente
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Fecha emisión
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Fecha vencimiento
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow
                key={invoice.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.client_name}</TableCell>
                <TableCell>{invoice.client_email}</TableCell>
                <TableCell>{invoice.issue_date}</TableCell>
                <TableCell>{invoice.due_date}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  {invoice.total}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleOpenDeleteDialog(invoice.id)}
                    sx={{ mr: 1 }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleOpenViewDialog(invoice.invoice_details)
                    }
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} mt={2} alignItems="center">
        <Pagination
          count={lastPage}
          page={currentPage}
          onChange={(_, page) => goToPage(page)}
          color="primary"
        />
      </Stack>
      <Dialog
        open={openDialogDelete}
        onClose={() => setOpenDialogDelete(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar esta factura?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogDelete(false)}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          La factura se eliminó correctamente
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialogView}
        onClose={() => setOpenDialogView(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ backgroundColor: "#1565c0", color: "white" }}>
          Detalles de la factura
        </DialogTitle>
        <DialogContent>
          {selectedInvoiceDetails.length === 0 ? (
            <Typography mt={2}>No hay detalles para esta factura</Typography>
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInvoiceDetails.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f1f8ff" : "white",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <TableCell>{item.item_code}</TableCell>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.unit_price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.applies_tax ? item.tax_amount : "0.00"}
                    </TableCell>
                    <TableCell>{item.subtotal}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#1565c0" }}>
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogView(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Invoices;
