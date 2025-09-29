import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Send, CreditCard } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  onDownload: () => void;
  onSend: () => void;
  onPayment: () => void;
}

export const InvoicePreview = ({ invoiceData, onDownload, onSend, onPayment }: InvoicePreviewProps) => {
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={onSend} variant="outline" size="sm">
          <Send className="w-4 h-4" />
          Send Invoice
        </Button>
        <Button onClick={onPayment} variant="professional" size="sm">
          <CreditCard className="w-4 h-4" />
          Accept Payment
        </Button>
      </div>

      {/* Invoice Preview */}
      <Card className="shadow-card">
        <CardContent id="invoice-preview" className="p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
              <p className="text-muted-foreground mt-1">#{invoiceData.invoiceNumber}</p>
            </div>
            <div className="text-right">
              {invoiceData.companyLogo && (
                <img 
                  src={invoiceData.companyLogo} 
                  alt="Company Logo" 
                  className="h-16 w-auto mb-4 ml-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <h2 className="text-xl font-semibold">{invoiceData.companyName}</h2>
              <div className="text-sm text-muted-foreground whitespace-pre-line mt-1">
                {invoiceData.companyAddress}
              </div>
              {invoiceData.companyEmail && (
                <div className="text-sm text-muted-foreground">{invoiceData.companyEmail}</div>
              )}
              {invoiceData.companyPhone && (
                <div className="text-sm text-muted-foreground">{invoiceData.companyPhone}</div>
              )}
            </div>
          </div>

          {/* Invoice Info and Bill To */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-3">BILL TO</h3>
              <div className="space-y-1">
                <div className="font-medium">{invoiceData.clientName}</div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {invoiceData.clientAddress}
                </div>
                {invoiceData.clientEmail && (
                  <div className="text-sm text-muted-foreground">{invoiceData.clientEmail}</div>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Issue Date:</span>
                  <span className="text-sm">{formatDate(invoiceData.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Due Date:</span>
                  <span className="text-sm">{formatDate(invoiceData.dueDate)}</span>
                </div>
                {invoiceData.paymentTerms && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Terms:</span>
                    <span className="text-sm">{invoiceData.paymentTerms}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
              <div className="col-span-6">DESCRIPTION</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-2 text-right">RATE</div>
              <div className="col-span-2 text-right">AMOUNT</div>
            </div>
            
            {invoiceData.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 text-sm py-2">
                <div className="col-span-6">{item.description}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">{formatCurrency(item.rate)}</div>
                <div className="col-span-2 text-right font-medium">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              {invoiceData.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>{formatCurrency(invoiceData.taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(invoiceData.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-2">NOTES</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {invoiceData.notes}
                </p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="pt-8 border-t text-center text-xs text-muted-foreground">
            Thank you for your business!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};