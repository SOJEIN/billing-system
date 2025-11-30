import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvoiceDetail } from "../pages/Invoices/InvoicesService";

interface Meta {
  id?: number | null;
  client_name?: string | null;
  client_email?: string | null;
  issue_date?: string | null;
  due_date?: string | null;
}

export const generateInvoicePDF = (
  meta: Meta,
  details: InvoiceDetail[],
  logoUrl?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Logo opcional ---
  const drawLogoAndPDF = () => {
    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        doc.addImage(img, "PNG", 14, 10, 40, 20);
        drawPDF();
      };
      img.onerror = () => drawPDF();
    } else {
      drawPDF();
    }
  };

  drawLogoAndPDF();

  function drawPDF() {
    // --- Encabezado ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Factura", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Factura #${meta.id ?? ""}`, 14, 35);
    if (meta.issue_date) doc.text(`Fecha emisión: ${meta.issue_date}`, 14, 41);
    if (meta.due_date) doc.text(`Fecha vencimiento: ${meta.due_date}`, 14, 47);
    doc.text(`Cliente: ${meta.client_name ?? ""}`, 14, 53);
    if (meta.client_email) doc.text(`Email: ${meta.client_email}`, 14, 59);

    // --- Preparar tabla ---
    const tableColumns = [
      "Código",
      "Producto",
      "Precio unitario",
      "Cantidad",
      "IVA",
      "Subtotal",
      "Total",
    ];

    const tableRows: any[] = details.map((item) => [
      item.item_code,
      item.item_name,
      Number(item.unit_price).toFixed(2),
      item.quantity,
      item.applies_tax ? Number(item.tax_amount).toFixed(2) : "0.00",
      Number(item.subtotal).toFixed(2),
      Number(item.total).toFixed(2),
    ]);

    // --- Variable para guardar la posición final de la tabla ---
    let lastTableFinalY = 70;

    // --- Dibujar tabla con callback didDrawPage ---
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 70,
      theme: "striped",
      headStyles: {
        fillColor: [33, 150, 243],
        halign: "center",
        textColor: 255,
      },
      bodyStyles: { halign: "center" },
      columnStyles: { 1: { halign: "left" } },
      margin: { top: 70 },
      didDrawPage: (data) => {
        // Cada vez que termina de dibujar una página, actualizar la posición final de la tabla
        lastTableFinalY = data.cursor.y;
      },
    });

    // --- Totales ---
    const totalsHeight = 30;
    let totalsStartY = lastTableFinalY + 10;

    // Si no hay suficiente espacio en la página, agregar nueva página
    if (totalsStartY + totalsHeight > pageHeight - 10) {
      doc.addPage();
      totalsStartY = 20;
    }

    const startX = pageWidth - 80;
    const boxWidth = 70;

    // Calcular totales
    const subtotal = details.reduce((acc, i) => acc + Number(i.subtotal), 0);
    const tax = details.reduce((acc, i) => acc + Number(i.tax_amount || 0), 0);
    const total = details.reduce((acc, i) => acc + Number(i.total), 0);

    // --- Dibujar cuadro de totales ---
    doc.setDrawColor(0);
    doc.setFillColor(240); // gris claro
    doc.rect(startX, totalsStartY, boxWidth, totalsHeight, "FD");

    // --- Texto dentro del cuadro ---
    const textX = startX + 5;
    let textY = totalsStartY + 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Subtotal:", textX, textY);
    doc.setFont("helvetica", "normal");
    doc.text(subtotal.toFixed(2), startX + boxWidth - 5, textY, {
      align: "right",
    });

    textY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("IVA:", textX, textY);
    doc.setFont("helvetica", "normal");
    doc.text(tax.toFixed(2), startX + boxWidth - 5, textY, { align: "right" });

    textY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL:", textX, textY);
    doc.text(total.toFixed(2), startX + boxWidth - 5, textY, {
      align: "right",
    });

    // --- Guardar PDF ---
    doc.save(`Factura_${meta.id}.pdf`);
  }
};
