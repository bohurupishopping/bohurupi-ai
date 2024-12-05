'use client';

import { useState } from 'react';
import { useToast } from "@/app/global/ui/use-toast";
import { Button } from "@/app/global/ui/button";
import { Input } from "@/app/global/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { CashfreeOrderResponse } from '@/app/types/cashfree';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb";

export default function CashfreePaymentsPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<CashfreeOrderResponse | null>(null);
  const { toast } = useToast();

  const fetchPaymentDetails = async () => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cashfree/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      const data = await response.json();
      setPaymentDetails(data);
      toast({
        title: "Success",
        description: "Payment details fetched successfully",
      });
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'PAID': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'FAILED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] m-4 space-y-4">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5" />
      
      <div className="relative space-y-4">
        <Breadcrumb className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-blue-600 dark:text-blue-400">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cashfree Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/50" />
                <Input
                  placeholder="Enter Order ID..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="pl-9 bg-white/50 dark:bg-gray-900/50"
                  onKeyDown={(e) => e.key === 'Enter' && fetchPaymentDetails()}
                />
              </div>
              <Button
                onClick={fetchPaymentDetails}
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Check Payment
              </Button>
            </div>

            {paymentDetails && (
              <div className="mt-6 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="font-medium">{paymentDetails.order_id}</p>
                      <p className="text-xs text-gray-400">CF Order ID: {paymentDetails.cf_order_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="font-medium">
                        {paymentDetails.order_currency} {paymentDetails.order_amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getStatusColor(paymentDetails.order_status)}`}>
                        {paymentDetails.order_status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="font-medium">{paymentDetails.customer_details.customer_name}</p>
                      <p className="text-sm text-gray-500">{paymentDetails.customer_details.customer_email}</p>
                      <p className="text-sm text-gray-500">{paymentDetails.customer_details.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                      <p className="font-medium">{new Date(paymentDetails.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expires At</p>
                      <p className="font-medium">{new Date(paymentDetails.order_expiry_time).toLocaleString()}</p>
                    </div>
                  </div>

                  {paymentDetails.order_note && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order Note</p>
                      <p className="font-medium">{paymentDetails.order_note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 