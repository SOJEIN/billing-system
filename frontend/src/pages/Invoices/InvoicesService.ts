import axios from "axios";

export interface InvoiceDetail {
  id: number;
  invoice_id: number;
  item_code: string;
  item_name: string;
  unit_price: string;
  quantity: number;
  applies_tax: number;
  tax_amount: string;
  subtotal: string;
  total: string;
}

export interface Invoice {
  id: number;
  client_identification: string;
  client_name: string;
  client_email: string;
  issue_date: string;
  due_date: string;
  invoice_type: string;
  user_id: number;
  subtotal: string;
  tax_total: string;
  total: string;
  created_at: string;
  updated_at: string;
  invoice_details: InvoiceDetail[];
}

const BASE_URL = "http://127.0.0.1:8000/api";

export const getInvoices = async (page: number = 1) => {
  const response = await axios.get(`${BASE_URL}/invoices?page=${page}`);
  return response.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/invoices/${id}`);
};

export const createInvoice = async (payload: Record<string, unknown>) => {
  const response = await axios.post(`${BASE_URL}/invoices`, payload);
  return response.data;
};
