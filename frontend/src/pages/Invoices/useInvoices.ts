import { useState, useEffect } from "react";
import { deleteInvoice, getInvoices, type Invoice } from "./InvoicesService";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const fetchInvoices = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getInvoices(page); // <-- pasar la página
      setInvoices(data.data); // <-- usar solo el array de facturas
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error("Error al cargar facturas:", error);
      setInvoices([]); // fallback para que no rompa la UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage); // <-- llamar con la página actual
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error al eliminar factura:", error);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page); // <-- esto disparará el useEffect y fetch de la nueva página
    }
  };

  const refresh = () => {
    fetchInvoices(currentPage);
  };

  return {
    invoices,
    loading,
    handleDelete,
    currentPage,
    lastPage,
    goToPage,
    refresh,
  };
};
