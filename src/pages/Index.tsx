import { useState } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { PaymentDialog } from "@/components/PaymentDialog";
import { InvoiceData } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    companyPhone: "",
    companyLogo: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: "",
    paymentTerms: "Net 30 days",
  });

  const handleDownload = () => {
    toast({
      title: "PDF Downloaded",
      description: "Invoice has been downloaded as PDF.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Invoice Sent",
      description: "Invoice has been sent to the client.",
    });
  };

  const handlePayment = () => {
    setPaymentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invoice Generator</h1>
              <p className="text-sm text-muted-foreground">Create professional invoices with instant payment processing</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            <InvoiceForm 
              invoiceData={invoiceData} 
              onInvoiceChange={setInvoiceData} 
            />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <InvoicePreview 
              invoiceData={invoiceData}
              onDownload={handleDownload}
              onSend={handleSend}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </main>

      {/* Payment Dialog */}
      <PaymentDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        invoiceData={invoiceData}
      />
    </div>
  );
};

export default Index;
