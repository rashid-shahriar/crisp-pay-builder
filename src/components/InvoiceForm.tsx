import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceData, InvoiceItem } from "@/types/invoice";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onInvoiceChange: (data: InvoiceData) => void;
}

export const InvoiceForm = ({ invoiceData, onInvoiceChange }: InvoiceFormProps) => {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onInvoiceChange({ ...invoiceData, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateField("items", [...invoiceData.items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    updateField("items", updatedItems);
    calculateTotals(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== id);
    updateField("items", updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    onInvoiceChange({
      ...invoiceData,
      items,
      subtotal,
      taxAmount,
      total,
    });
  };

  return (
    <Card className="h-fit shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={invoiceData.issueDate}
              onChange={(e) => updateField("issueDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Company Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Company Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={invoiceData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={invoiceData.companyEmail}
                onChange={(e) => updateField("companyEmail", e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                id="companyAddress"
                value={invoiceData.companyAddress}
                onChange={(e) => updateField("companyAddress", e.target.value)}
                placeholder="123 Business St, City, State 12345"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                value={invoiceData.companyPhone}
                onChange={(e) => updateField("companyPhone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Client Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Bill To</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={invoiceData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Client Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoiceData.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea
                id="clientAddress"
                value={invoiceData.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                placeholder="456 Client Ave, City, State 54321"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Invoice Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Invoice Items</h3>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {invoiceData.items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Service or product description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate ($)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={item.amount.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tax and Totals */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={invoiceData.taxRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value) || 0;
                updateField("taxRate", rate);
                calculateTotals(invoiceData.items);
              }}
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <Separator />

        {/* Notes and Payment Terms */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Additional notes or payment instructions"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={invoiceData.paymentTerms}
              onChange={(e) => updateField("paymentTerms", e.target.value)}
              placeholder="Net 30 days"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};