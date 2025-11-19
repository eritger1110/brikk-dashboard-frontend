import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import {
  DollarSign,
  CreditCard,
  Download,
  Plus,
  Trash2,
  Check,
  Calendar,
  TrendingUp,
  Zap,
} from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault: boolean;
}

function PaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        // TODO: Send paymentMethod.id to backend
        console.log('Payment method created:', paymentMethod.id);
        toast.success('Payment method added successfully');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment method error:', error);
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-border rounded-lg bg-background">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'hsl(var(--foreground))',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '::placeholder': {
                  color: 'hsl(var(--muted-foreground))',
                },
              },
              invalid: {
                color: 'hsl(var(--destructive))',
              },
            },
          }}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function BillingEnhanced() {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      brand: 'Visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025,
      isDefault: true,
    },
  ]);

  const handlePaymentMethodAdded = () => {
    setShowAddPaymentModal(false);
    // Refresh payment methods from backend
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      toast.success('Payment method removed');
    }
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
    toast.success('Default payment method updated');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and invoices
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Current Plan</h2>
                  <p className="text-sm text-muted-foreground">
                    Professional Plan - $99/month
                  </p>
                </div>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">API Calls</span>
                  </div>
                  <p className="text-2xl font-bold">50,000</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Overage</span>
                  </div>
                  <p className="text-2xl font-bold">$0.002</p>
                  <p className="text-xs text-muted-foreground">per request</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Next Billing</span>
                  </div>
                  <p className="text-2xl font-bold">Feb 1</p>
                  <p className="text-xs text-muted-foreground">2025</p>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Payment Methods</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your credit cards and payment options
                  </p>
                </div>
                <Button onClick={() => setShowAddPaymentModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {pm.brand} •••• {pm.last4}
                          </span>
                          {pm.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expires {pm.exp_month}/{pm.exp_year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!pm.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaymentMethod(pm.id)}
                        disabled={pm.isDefault && paymentMethods.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Invoice History */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Invoice History</h2>
                  <p className="text-sm text-muted-foreground">
                    Download past invoices and receipts
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'inv_1', date: 'Jan 1, 2025', amount: '$99.00', status: 'Paid' },
                  { id: 'inv_2', date: 'Dec 1, 2024', amount: '$99.00', status: 'Paid' },
                  { id: 'inv_3', date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid' },
                ].map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Invoice {invoice.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <p className="text-sm text-green-500">{invoice.status}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Usage */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Current Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">API Calls</span>
                    <span className="text-sm font-medium">12,847 / 50,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '25.7%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Bill</span>
                    <span className="text-sm font-medium">$99.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No overage charges this month
                  </p>
                </div>
              </div>
            </Card>

            {/* Billing Contact */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Billing Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">billing@company.com</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">
                    123 Business St<br />
                    San Francisco, CA 94105
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Update Contact Info
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Dialog open={showAddPaymentModal} onOpenChange={setShowAddPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account
            </DialogDescription>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <PaymentMethodForm onSuccess={handlePaymentMethodAdded} />
          </Elements>
        </DialogContent>
      </Dialog>
    </div>
  );
}
