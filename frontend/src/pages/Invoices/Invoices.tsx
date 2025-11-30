import React, { useState } from "react";
import { useInvoices } from "./useInvoices";
import { Typography, Box, Snackbar, Alert } from "@mui/material";

import type { Invoice, InvoiceDetail } from "./InvoicesService";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceDetailsDialog from "./components/InvoiceDetailsDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import type { Meta } from "./types";

const Invoices: React.FC = () => {
  const { invoices, loading, handleDelete, currentPage, lastPage, goToPage } =
    useInvoices();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [openDialogView, setOpenDialogView] = useState(false);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<
    InvoiceDetail[]
  >([]);
  const [selectedInvoiceMeta, setSelectedInvoiceMeta] = useState<Meta | null>(
    null
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
  const handleOpenViewDialog = (
    details: InvoiceDetail[],
    meta?: Meta | null
  ) => {
    setSelectedInvoiceDetails(details ?? []);
    setSelectedInvoiceMeta(meta ?? null);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(180deg, #f3f8ff 0%, #ffffff 100%)",
          p: { xs: 2, md: 6 },
          minHeight: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Table component refactored into child component */}
          <InvoiceTable
            invoices={invoices as Invoice[]}
            onView={(details, meta) =>
              handleOpenViewDialog(details as InvoiceDetail[], meta ?? null)
            }
            onDelete={(id) => handleOpenDeleteDialog(id)}
            currentPage={currentPage}
            lastPage={lastPage}
            goToPage={goToPage}
          />
          {/* Pagination moved into InvoiceTable */}
        </Box>
      </Box>
      <DeleteConfirmDialog
        open={openDialogDelete}
        id={selectedInvoiceId}
        onClose={() => setOpenDialogDelete(false)}
        onConfirm={handleConfirmDelete}
      />
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
      <InvoiceDetailsDialog
        open={openDialogView}
        onClose={() => setOpenDialogView(false)}
        details={selectedInvoiceDetails}
        meta={selectedInvoiceMeta}
      />
    </>
  );
};

export default Invoices;
