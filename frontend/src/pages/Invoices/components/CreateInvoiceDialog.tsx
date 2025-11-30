import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
} from "@mui/material";
import { createInvoice } from "../InvoicesService";
import type { InvoiceDetail } from "../InvoicesService";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // callback to let parent refresh
}

const CreateInvoiceDialog: React.FC<Props> = ({ open, onClose, onCreated }) => {
  // Invoice basic fields
  const [clientIdentification, setClientIdentification] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceType, setInvoiceType] = useState("cash");

  // Single item detail for simplicity
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">(1);
  const [appliesTax, setAppliesTax] = useState(false);
  const [creditDays, setCreditDays] = useState<number>(0);
  const [userId, setUserId] = useState<number>(1);

  const [submitting, setSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!clientIdentification || clientIdentification.trim() === "") {
      errors.client_identification = ["El campo identificación es obligatorio"];
    } else if (clientIdentification.length > 20) {
      errors.client_identification = [
        "Identificación demasiado larga (max 20)",
      ];
    }
    if (!clientName || clientName.trim() === "") {
      errors.client_name = ["El nombre del cliente es obligatorio"];
    }
    if (!clientEmail || clientEmail.trim() === "") {
      errors.client_email = ["El email es obligatorio"];
    } else if (!emailRegex.test(clientEmail)) {
      errors.client_email = ["Formato de email inválido"];
    }
    if (!issueDate || issueDate.trim() === "") {
      errors.issue_date = ["Fecha de emisión es obligatoria"];
    }
    if (!dueDate || dueDate.trim() === "") {
      errors.due_date = ["Fecha de vencimiento es obligatoria"];
    }
    if (!Number.isInteger(Number(creditDays))) {
      errors.credit_days = ["Los días de crédito deben ser un número entero"];
    }
    if (Number(creditDays) < 0) {
      errors.credit_days = ["Los días de crédito deben ser >= 0"];
    }
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      errors.user_id = [
        "El campo user_id es requerido y debe ser un entero positivo",
      ];
    }

    // Items validation: single item present
    if (!itemCode || itemCode.trim() === "") {
      errors["items.*.code"] = ["El código del item es obligatorio"];
    }
    if (!itemName || itemName.trim() === "") {
      errors["items.*.name"] = ["El nombre del item es obligatorio"];
    }
    if (unitPrice === "" || Number(unitPrice) <= 0) {
      errors["items.*.unit_price"] = ["El precio unitario debe ser mayor a 0"];
    }
    if (quantity === "" || Number(quantity) <= 0) {
      errors["items.*.quantity"] = ["La cantidad debe ser mayor a 0"];
    }

    return errors;
  };

  const taxRate = 0.1; // 10% default

  const computeSubtotal = () => Number(unitPrice || 0) * Number(quantity || 0);
  const computeTax = () => (appliesTax ? computeSubtotal() * taxRate : 0);
  const computeTotal = () => computeSubtotal() + computeTax();

  const canSubmit = () => {
    return (
      clientName.trim() !== "" &&
      clientEmail.trim() !== "" &&
      issueDate.trim() !== "" &&
      dueDate.trim() !== "" &&
      itemName.trim() !== "" &&
      itemCode.trim() !== "" &&
      unitPrice !== "" &&
      Number(unitPrice) > 0 &&
      quantity !== "" &&
      Number(quantity) > 0
    );
  };

  const clearErrors = (fields?: string[]) => {
    if (!fields) return setApiErrors({});
    const next = { ...apiErrors };
    fields.forEach((f) => delete next[f]);
    setApiErrors(next);
  };

  const handleSubmit = async () => {
    clearErrors();
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setApiErrors(clientErrors);
      return;
    }
    if (!canSubmit()) return;
    setSubmitting(true);
    try {
      // Map to backend expected keys: items[*].code, items[*].name, unit_price, quantity, tax_amount, tax_rate, description, total
      const items = [
        {
          code: itemCode,
          name: itemName,
          unit_price: Number(unitPrice),
          quantity: Number(quantity),
          tax_amount: Number(computeTax()),
          tax_rate: appliesTax ? taxRate * 100 : 0,
          description: "",
          total: Number(computeTotal()),
        },
      ];
      const payload = {
        client_identification: clientIdentification,
        client_name: clientName,
        client_email: clientEmail,
        issue_date: issueDate,
        due_date: dueDate,
        invoice_type: invoiceType,
        credit_days: Number(creditDays),
        user_id: Number(userId),
        subtotal: Number(computeSubtotal()),
        tax_total: Number(computeTax()),
        total: Number(computeTotal()),
        items,
      };

      await createInvoice(payload);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      const axiosErr = error as any;
      if (axiosErr?.response?.data?.errors) {
        setApiErrors(axiosErr.response.data.errors);
      } else {
        setApiErrors({ general: ["Error creando la factura"] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Crear factura</DialogTitle>
      <DialogContent>
        {Object.keys(apiErrors).length > 0 && (
          <Box mb={2}>
            <Alert severity="error">
              {Object.values(apiErrors).flat().slice(0, 5).join(" — ")}
            </Alert>
          </Box>
        )}
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Identificación"
                value={clientIdentification}
                onChange={(e) => setClientIdentification(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Cliente"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  clearErrors(["client_name"]);
                }}
                fullWidth
                required
                error={!!apiErrors.client_name}
                helperText={
                  apiErrors.client_name ? apiErrors.client_name.join(" ") : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Email"
                value={clientEmail}
                onChange={(e) => {
                  setClientEmail(e.target.value);
                  clearErrors(["client_email"]);
                }}
                fullWidth
                required
                error={!!apiErrors.client_email}
                helperText={
                  apiErrors.client_email ? apiErrors.client_email.join(" ") : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha emisión"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha vencimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="invoice-type-label">Tipo</InputLabel>
                <Select
                  labelId="invoice-type-label"
                  value={invoiceType}
                  label="Tipo"
                  onChange={(e) => setInvoiceType(String(e.target.value))}
                >
                  <MenuItem value="cash">Contado</MenuItem>
                  <MenuItem value="credit">Crédito</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Días de crédito"
                type="number"
                value={creditDays}
                onChange={(e) => {
                  setCreditDays(Number(e.target.value));
                  clearErrors(["credit_days"]);
                }}
                fullWidth
                error={!!apiErrors.credit_days}
                helperText={
                  apiErrors.credit_days ? apiErrors.credit_days.join(" ") : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Usuario (ID)"
                type="number"
                value={userId}
                onChange={(e) => {
                  setUserId(Number(e.target.value));
                  clearErrors(["user_id"]);
                }}
                fullWidth
                error={!!apiErrors.user_id}
                helperText={
                  apiErrors.user_id ? apiErrors.user_id.join(" ") : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Detalles
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Código"
                value={itemCode}
                onChange={(e) => {
                  setItemCode(e.target.value);
                  clearErrors(["items.*.code", "items"]);
                }}
                fullWidth
                required
                error={!!apiErrors["items.*.code"] || !!apiErrors.items}
                helperText={
                  apiErrors["items.*.code"]
                    ? apiErrors["items.*.code"].join(" ")
                    : apiErrors.items
                    ? apiErrors.items.join(" ")
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Producto"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  clearErrors(["items.*.name", "items"]);
                }}
                fullWidth
                required
                error={!!apiErrors["items.*.name"]}
                helperText={
                  apiErrors["items.*.name"]
                    ? apiErrors["items.*.name"].join(" ")
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TableContainer component={Box} sx={{ mt: 2, p: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Producto
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Precio unitario
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Cantidad
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        IVA
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Subtotal
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{itemCode || "-"}</TableCell>
                      <TableCell>{itemName || "-"}</TableCell>
                      <TableCell align="right">
                        {Number(unitPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {Number(quantity || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {computeTax().toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {computeSubtotal().toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {computeTotal().toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Precio unitario"
                type="number"
                value={unitPrice}
                onChange={(e) =>
                  setUnitPrice(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                fullWidth
                required
                error={!!apiErrors["items.*.unit_price"]}
                helperText={
                  apiErrors["items.*.unit_price"]
                    ? apiErrors["items.*.unit_price"].join(" ")
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Cantidad"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                fullWidth
                required
                error={!!apiErrors["items.*.quantity"]}
                helperText={
                  apiErrors["items.*.quantity"]
                    ? apiErrors["items.*.quantity"].join(" ")
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appliesTax}
                    onChange={(e) => setAppliesTax(e.target.checked)}
                  />
                }
                label="Aplicar IVA (10%)"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  Subtotal: {computeSubtotal().toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  IVA: {computeTax().toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Total: {computeTotal().toFixed(2)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit() || submitting}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
