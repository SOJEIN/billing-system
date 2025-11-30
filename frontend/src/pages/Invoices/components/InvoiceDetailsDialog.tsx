import React, { useState, useEffect } from "react";
import { createInvoiceDetail } from "../InvoicesService";
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
import { generateInvoicePDF } from "../../../utils/invoicePDF";

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
  // onAddDetail receives the created detail and allows parent to update state
  onAddDetail?: (detail: InvoiceDetail) => void;
}

const InvoiceDetailsDialog: React.FC<Props> = ({
  open,
  onClose,
  details,
  meta,
  onAddDetail,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    item_code: "",
    item_name: "",
    unit_price: "",
    quantity: "",
    applies_tax: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [internalDetails, setInternalDetails] = useState<InvoiceDetail[]>(
    details || []
  );
  const [preview, setPreview] = useState<
    (Partial<InvoiceDetail> & { unit_price: number; quantity: number }) | null
  >(null);

  useEffect(() => {
    const newIds = (details || []).map((d) => d.id ?? "").join(",");
    const currentIds = internalDetails.map((d) => d.id ?? "").join(",");
    if (newIds !== currentIds) {
      setInternalDetails(details || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const TAX_RATE = 0.19;

  // On submit, open preview instead of immediately saving
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta?.id) return;
    // Compute numeric values and totals for preview
    const unitPriceNum = Number.parseFloat(String(form.unit_price)) || 0;
    const quantityNum = Number.parseInt(String(form.quantity), 10) || 0;
    const subtotalNum = unitPriceNum * quantityNum;
    const taxAmountNum = form.applies_tax ? subtotalNum * TAX_RATE : 0;
    const totalNum = subtotalNum + taxAmountNum;

    const previewItem = {
      id: undefined,
      invoice_id: meta.id,
      item_code: form.item_code,
      item_name: form.item_name,
      unit_price: unitPriceNum,
      quantity: quantityNum,
      applies_tax: form.applies_tax ? 1 : 0,
      tax_amount: taxAmountNum.toFixed(2),
      subtotal: subtotalNum.toFixed(2),
      total: totalNum.toFixed(2),
    } as Partial<InvoiceDetail> & { unit_price: number; quantity: number };

    setPreview(previewItem);
    setShowPreview(true);
  };

  const handleConfirmCreate = async () => {
    if (!preview || !meta?.id) return;
    try {
      const payload = {
        invoice_id: preview.invoice_id,
        item_code: preview.item_code,
        item_name: preview.item_name,
        unit_price: preview.unit_price,
        quantity: preview.quantity,
        applies_tax: preview.applies_tax ? 1 : 0,
      };
      const created = (await createInvoiceDetail(payload)) as InvoiceDetail;
      setInternalDetails((prev) => [...prev, created]);
      if (onAddDetail) onAddDetail(created);
      // Reset form and preview
      setShowForm(false);
      setShowPreview(false);
      setPreview(null);
      setForm({
        item_code: "",
        item_name: "",
        unit_price: "",
        quantity: "",
        applies_tax: false,
      });
    } catch {
      alert("Error al agregar el detalle");
    }
  };
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
        {showForm && (
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Agregar nuevo producto
            </Typography>
            <form
              onSubmit={handleFormSubmit}
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                name="item_code"
                placeholder="Código"
                value={form.item_code}
                onChange={handleInputChange}
                required
                style={{
                  padding: 6,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                name="item_name"
                placeholder="Producto"
                value={form.item_name}
                onChange={handleInputChange}
                required
                style={{
                  padding: 6,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                name="unit_price"
                placeholder="Precio unitario"
                type="number"
                min="0"
                value={form.unit_price}
                onChange={handleInputChange}
                required
                style={{
                  padding: 6,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  width: 110,
                }}
              />
              <input
                name="quantity"
                placeholder="Cantidad"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleInputChange}
                required
                style={{
                  padding: 6,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  width: 90,
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  name="applies_tax"
                  type="checkbox"
                  checked={form.applies_tax}
                  onChange={handleInputChange}
                />
                <span>Aplica IVA</span>
              </label>
              {form.applies_tax && (
                <span style={{ fontWeight: 500, color: "#1976d2" }}>
                  IVA: 19%
                </span>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Guardar
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setShowPreview(false);
                  setPreview(null);
                }}
                variant="outlined"
                color="secondary"
                size="small"
              >
                Cancelar
              </Button>
            </form>
            {showPreview && preview && (
              <Box
                mt={2}
                p={2}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  background: "#fafafa",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Resumen del detalle a guardar
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Typography>
                    <strong>Código:</strong> {preview.item_code}
                  </Typography>
                  <Typography>
                    <strong>Producto:</strong> {preview.item_name}
                  </Typography>
                  <Typography>
                    <strong>Precio unitario:</strong>{" "}
                    {Number(preview.unit_price).toFixed(2)}
                  </Typography>
                  <Typography>
                    <strong>Cantidad:</strong> {Number(preview.quantity)}
                  </Typography>
                  <Typography>
                    <strong>Aplica IVA:</strong>{" "}
                    {preview.applies_tax ? "Sí" : "No"}
                  </Typography>
                  <Typography>
                    <strong>IVA:</strong>{" "}
                    {preview.applies_tax
                      ? Number(preview.tax_amount).toFixed(2)
                      : "0.00"}
                  </Typography>
                  <Typography>
                    <strong>Subtotal:</strong>{" "}
                    {Number(preview.subtotal).toFixed(2)}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> {Number(preview.total).toFixed(2)}
                  </Typography>
                </Box>
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    onClick={handleConfirmCreate}
                    variant="contained"
                    color="primary"
                  >
                    Confirmar
                  </Button>
                  <Button
                    onClick={() => setShowPreview(false)}
                    variant="outlined"
                    color="secondary"
                  >
                    Editar
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
        {internalDetails.length === 0 ? (
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
                {internalDetails.map((item, idx) => (
                  <TableRow
                    key={item.id ?? `new-${idx}`}
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
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          variant="outlined"
          color="primary"
          disabled={showForm}
        >
          Agregar producto
        </Button>
        <Button
          onClick={() =>
            meta && generateInvoicePDF(meta, internalDetails, "/logo.png")
          }
          variant="contained"
          color="secondary"
          disabled={internalDetails.length === 0}
        >
          Descargar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
