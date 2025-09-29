import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Building, Smartphone } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData;
}

export const PaymentDialog = ({ open, onOpenChange, invoiceData }: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onOpenChange(false);
    
    toast({
      title: "Payment Processed",
      description: `Payment of ${formatCurrency(invoiceData.total)} has been processed successfully.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accept Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Invoice:</span>
                  <span className="font-medium">#{invoiceData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Client:</span>
                  <span className="font-medium">{invoiceData.clientName}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(invoiceData.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="h-16 flex-col gap-1"
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                variant={paymentMethod === "bank" ? "default" : "outline"}
                onClick={() => setPaymentMethod("bank")}
                className="h-16 flex-col gap-1"
              >
                <Building className="w-5 h-5" />
                <span className="text-xs">Bank</span>
              </Button>
              <Button
                variant={paymentMethod === "mobile" ? "default" : "outline"}
                onClick={() => setPaymentMethod("mobile")}
                className="h-16 flex-col gap-1"
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">Mobile</span>
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankSelect">Select Bank</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chase">Chase Bank</SelectItem>
                    <SelectItem value="bofa">Bank of America</SelectItem>
                    <SelectItem value="wells">Wells Fargo</SelectItem>
                    <SelectItem value="citi">Citibank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg text-sm text-center">
                You will be redirected to your bank's secure portal to complete the payment.
              </div>
            </div>
          )}

          {paymentMethod === "mobile" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileSelect">Mobile Payment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applepay">Apple Pay</SelectItem>
                    <SelectItem value="googlepay">Google Pay</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                    <SelectItem value="cashapp">Cash App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg text-sm text-center">
                Complete payment using your mobile wallet without creating an account.
              </div>
            </div>
          )}

          {/* Process Payment Button */}
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full"
            variant="professional"
          >
            {isProcessing ? "Processing..." : `Pay ${formatCurrency(invoiceData.total)}`}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            Secure payment processing • No account required • 256-bit SSL encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};