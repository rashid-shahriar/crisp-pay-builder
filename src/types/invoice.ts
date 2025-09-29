export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  
  // Company details
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  companyLogo: string;
  
  // Client details
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  
  // Invoice items
  items: InvoiceItem[];
  
  // Financial details
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Notes
  notes: string;
  paymentTerms: string;
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal' | 'bank';
  name: string;
  enabled: boolean;
}