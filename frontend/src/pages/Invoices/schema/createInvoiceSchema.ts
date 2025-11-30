import { z } from "zod";

export const ItemSchema = z.object({
  code: z.string().min(1, "El código del item es obligatorio"),
  name: z.string().min(1, "El nombre del item es obligatorio"),
  unit_price: z.number().min(0, "El precio unitario debe ser >= 0"),
  quantity: z.number().min(0, "La cantidad debe ser >= 0"),
  tax_amount: z.number().min(0, "El impuesto debe ser >= 0"),
  tax_rate: z.number().min(0, "La tasa de IVA debe ser >= 0"),
  description: z.string().optional(),
  total: z.number().min(0, "El total debe ser >= 0"),
});

export const CreateInvoiceSchema = z
  .object({
    client_identification: z
      .string()
      .min(1, "Identificación obligatoria")
      .max(20),
    client_name: z.string().min(1, "Cliente obligatorio").max(255),
    client_email: z.string().email("Email inválido"),
    issue_date: z.string().min(1, "Fecha de emisión obligatoria"),
    due_date: z.string().min(1, "Fecha de vencimiento obligatoria"),
    credit_days: z.number().int().nonnegative("Días de crédito debe ser >= 0"),
    invoice_type: z.enum(["cash", "credit"]),
    user_id: z.number().int().positive("user_id debe ser un entero > 0"),
    items: z.array(ItemSchema).min(1, "Se requiere al menos un item"),
    subtotal: z.number(),
    tax_total: z.number(),
    total: z.number(),
  })
  .superRefine((data, ctx) => {
    // Verify due_date >= issue_date
    try {
      const issue = new Date(data.issue_date);
      const due = new Date(data.due_date);
      if (isNaN(issue.getTime()) || isNaN(due.getTime())) {
        // invalid dates, leave to required check
      } else if (due < issue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["due_date"],
          message:
            "Fecha de vencimiento debe ser posterior a la fecha de emisión",
        });
      }
    } catch {
      // ignore
    }
    // If credit invoice, ensure credit_days > 0
    if (
      data.invoice_type === "credit" &&
      (!Number.isInteger(data.credit_days) || data.credit_days <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["credit_days"],
        message:
          "Para facturas a crédito, los días de crédito deben ser mayores a 0",
      });
    }
  });

export type CreateInvoicePayload = z.infer<typeof CreateInvoiceSchema>;
