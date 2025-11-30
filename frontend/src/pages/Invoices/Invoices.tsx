import React, { useState } from "react";
import { useInvoices } from "./useInvoices";
import { Typography, Box, Snackbar, Alert, Button } from "@mui/material";

import type { Invoice, InvoiceDetail } from "./InvoicesService";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceDetailsDialog from "./components/InvoiceDetailsDialog";
import CreateInvoiceDialog from "./components/CreateInvoiceDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import type { Meta } from "./types";

const Invoices: React.FC = () => {
  const {
    invoices,
    loading,
    handleDelete,
    currentPage,
    lastPage,
    goToPage,
    refresh,
  } = useInvoices();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [createdSnackbarOpen, setCreatedSnackbarOpen] = useState(false);

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

  const handleOpenViewDialog = (
    details: InvoiceDetail[],
    meta?: Meta | null
  ) => {
    setSelectedInvoiceDetails(details ?? []);
    setSelectedInvoiceMeta(meta ?? null);
    setOpenDialogView(true);
  };

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

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
          <Box width="100%" display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateDialog(true)}
            >
              Crear factura
            </Button>
          </Box>
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
        </Box>
      </Box>
      <DeleteConfirmDialog
        open={openDialogDelete}
        id={selectedInvoiceId}
        onClose={() => setOpenDialogDelete(false)}
        onConfirm={handleConfirmDelete}
      />
      <CreateInvoiceDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={() => {
          setOpenCreateDialog(false);
          refresh();
          setCreatedSnackbarOpen(true);
        }}
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
      <Snackbar
        open={createdSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCreatedSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setCreatedSnackbarOpen(false)}
        >
          La factura se creó correctamente
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
