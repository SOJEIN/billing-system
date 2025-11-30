import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Invoice } from "../InvoicesService";

interface Props {
  invoices: Invoice[];
  onView: (
    details: Invoice["invoice_details"],
    meta?: { id?: number; client_name?: string; client_email?: string } | null
  ) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  lastPage: number;
  goToPage: (page: number) => void;
}

const InvoiceTable: React.FC<Props> = ({
  invoices,
  onView,
  onDelete,
  currentPage,
  lastPage,
  goToPage,
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.95)",
          mx: "auto",
          width: "100%",
          maxWidth: 1000,
        }}
      >
        <Table sx={{ width: "100%", minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Cliente
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Tipo de factura
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Fecha emisión
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Fecha vencimiento
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", py: 1.25 }}>
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
                <TableCell sx={{ py: 1.25 }}>{invoice.id}</TableCell>
                <TableCell sx={{ py: 1.25 }}>{invoice.client_name}</TableCell>
                <TableCell>{invoice.client_email}</TableCell>
                <TableCell>{invoice.invoice_type}</TableCell>
                <TableCell sx={{ py: 1.25 }}>{invoice.issue_date}</TableCell>
                <TableCell sx={{ py: 1.25 }}>{invoice.due_date}</TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#1976d2", py: 1.25 }}
                >
                  {invoice.total}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(invoice.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() =>
                          onView(invoice.invoice_details, {
                            id: invoice.id,
                            client_name: invoice.client_name,
                            client_email: invoice.client_email,
                          })
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
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
    </Box>
  );
};

export default InvoiceTable;
