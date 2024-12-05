'use client';

import { useEffect, useState, useCallback } from "react";

import { Button } from "@/app/global/ui/button";
import api from "@/app/lib/woocommerce";
import { WooCommerceOrder } from "@/app/types/woocommerce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/global/ui/table";
import { Badge } from "@/app/global/ui/badge";
import { format } from "date-fns";
import { RefreshCw, Package2, Search, ShoppingBag, } from "lucide-react";
import { useToast } from "@/app/global/ui/use-toast";
import { WooOrderDetailsDialog } from "../../admin-components/orders/WooOrderDetailsDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb";
import { Input } from "@/app/global/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/global/ui/select";


interface TrackingInfo {
  number?: string;
  provider?: string;
  url?: string;
}

function isMobileScreen() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // 768px is the standard md breakpoint
}

export default function WooOrdersPage() {
  const [orders, setOrders] = useState<WooCommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<WooCommerceOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 25;
  const [isMobile, setIsMobile] = useState(isMobileScreen());

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileScreen());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getOrders({
        context: 'view',
        per_page: ordersPerPage,
        page: currentPage,
        orderby: 'date',
        order: 'desc',
        status: statusFilter !== 'any' ? statusFilter : undefined,
        search: searchQuery || undefined
      });

      setOrders(response.orders);
      setTotalPages(response.totalPages);

      toast({
        title: "Success",
        description: "Orders fetched successfully",
      });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const handleOrderClick = (order: WooCommerceOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string): { 
    bg: string; 
    text: string; 
    border: string;
    rowBg: string;
    rowHover: string;
  } => {
    const statusColors: Record<string, { 
      bg: string; 
      text: string; 
      border: string;
      rowBg: string;
      rowHover: string;
    }> = {
      'pending': { 
        bg: 'bg-amber-500', 
        text: 'text-white font-medium',
        border: 'border-amber-600',
        rowBg: 'bg-amber-50/50 dark:bg-amber-900/10',
        rowHover: 'hover:bg-amber-100/50 dark:hover:bg-amber-800/20'
      },
      'processing': { 
        bg: 'bg-blue-500', 
        text: 'text-white font-medium',
        border: 'border-blue-600',
        rowBg: 'bg-blue-50/50 dark:bg-blue-900/10',
        rowHover: 'hover:bg-blue-100/50 dark:hover:bg-blue-800/20'
      },
      'on-hold': { 
        bg: 'bg-orange-500', 
        text: 'text-white font-medium',
        border: 'border-orange-600',
        rowBg: 'bg-orange-50/50 dark:bg-orange-900/10',
        rowHover: 'hover:bg-orange-100/50 dark:hover:bg-orange-800/20'
      },
      'completed': { 
        bg: 'bg-emerald-500', 
        text: 'text-white font-medium',
        border: 'border-emerald-600',
        rowBg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
        rowHover: 'hover:bg-emerald-100/50 dark:hover:bg-emerald-800/20'
      },
      'cancelled': { 
        bg: 'bg-rose-500', 
        text: 'text-white font-medium',
        border: 'border-rose-600',
        rowBg: 'bg-rose-50/50 dark:bg-rose-900/10',
        rowHover: 'hover:bg-rose-100/50 dark:hover:bg-rose-800/20'
      },
      'refunded': { 
        bg: 'bg-purple-500', 
        text: 'text-white font-medium',
        border: 'border-purple-600',
        rowBg: 'bg-fuchsia-50/50 dark:bg-fuchsia-900/10',
        rowHover: 'hover:bg-fuchsia-100/50 dark:hover:bg-fuchsia-800/20'
      },
      'failed': { 
        bg: 'bg-red-500', 
        text: 'text-white font-medium',
        border: 'border-red-600',
        rowBg: 'bg-red-50/50 dark:bg-red-900/10',
        rowHover: 'hover:bg-red-100/50 dark:hover:bg-red-800/20'
      },
      'trash': { 
        bg: 'bg-slate-500', 
        text: 'text-white font-medium',
        border: 'border-slate-600',
        rowBg: 'bg-slate-50/50 dark:bg-slate-900/10',
        rowHover: 'hover:bg-slate-100/50 dark:hover:bg-slate-800/20'
      }
    };
    return statusColors[status] || { 
      bg: 'bg-gray-500', 
      text: 'text-white font-medium',
      border: 'border-gray-600',
      rowBg: 'bg-gray-50/50 dark:bg-gray-900/10',
      rowHover: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/20'
    };
  };

  const _getTrackingInfo = (order: WooCommerceOrder): TrackingInfo | null => {
    // Look for tracking meta in different possible formats
    const trackingMeta = order.meta_data?.find((meta: { 
      id: number;
      key: string;
      value: string;
      display_key: string;
      display_value: string;
    }) => 
      meta.key === '_wc_shipment_tracking_items' || 
      meta.key === 'wc_shipment_tracking_items' ||
      meta.key === '_tracking_number'
    );

    if (!trackingMeta) return null;

    try {
      // If it's an array of tracking items
      if (typeof trackingMeta.value === 'string' && trackingMeta.value.startsWith('[')) {
        const trackingItems = JSON.parse(trackingMeta.value);
        if (trackingItems && trackingItems.length > 0) {
          return {
            number: trackingItems[0].tracking_number,
            provider: trackingItems[0].tracking_provider,
            url: trackingItems[0].tracking_link || trackingItems[0].tracking_url
          };
        }
      }
      
      // If it's a single tracking number
      if (typeof trackingMeta.value === 'string') {
        return {
          number: trackingMeta.value
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing tracking info:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center m-4">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              B
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)] m-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] m-2 sm:m-4 space-y-3 sm:space-y-6 relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5" />
      
      <div className="relative space-y-3 sm:space-y-6">
        <Breadcrumb className="z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-blue-600 dark:text-blue-400">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>WooCommerce Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-3 sm:space-y-4 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-6">
          <div className="lg:sticky lg:top-20 z-10 -mx-2 sm:-mx-6 -mt-2 sm:-mt-6 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-2 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/50" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full bg-white/50 dark:bg-gray-900/50 border-blue-200/50 dark:border-blue-700/50 focus:border-blue-500 dark:focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/50 dark:bg-gray-900/50 border-blue-200/50 dark:border-blue-700/50">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={fetchOrders}
                className="w-full sm:w-auto gap-2 whitespace-nowrap bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 border-0"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="relative -mx-2 sm:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-xl pointer-events-none" />
            
            <div className="relative overflow-x-auto rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/50 dark:to-indigo-900/50">
                    <TableHead className="font-semibold">Order</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    {!isMobile && (
                      <>
                        <TableHead className="font-semibold">Items</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const statusColor = getStatusColor(order.status);
                    return (
                      <TableRow 
                        key={order.id} 
                        className={`cursor-pointer transition-colors ${statusColor.rowBg} ${statusColor.rowHover}`}
                        onClick={() => handleOrderClick(order)}
                      >
                        <TableCell className="py-2 sm:py-4">
                          <div className="space-y-1">
                            <p className="font-medium">#{order.number}</p>
                            {isMobile && (
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {order.currency} {parseFloat(order.total).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 sm:py-4">
                          <Badge className={`${statusColor.bg} ${statusColor.text} border ${statusColor.border} text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 sm:py-4">
                          <div>
                            <p className="font-medium text-sm sm:text-base bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                              {order.billing.first_name} {order.billing.last_name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{order.billing.email}</p>
                            {isMobile && (
                              <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-muted-foreground">
                                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {order.line_items.length} items
                              </div>
                            )}
                          </div>
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell>
                              <span className="inline-flex items-center gap-1.5">
                                <ShoppingBag className="h-4 w-4 text-violet-500/50" />
                                {order.line_items.length} items
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                              {order.currency} {parseFloat(order.total).toFixed(2)}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={isMobile ? 3 : 5}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="p-3 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-900/50 dark:to-pink-900/50 mb-2">
                            <Package2 className="h-8 w-8 text-violet-500" />
                          </div>
                          <p>No orders found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/50 dark:to-indigo-900/50 gap-2">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="flex-1 sm:flex-none border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="flex-1 sm:flex-none border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WooOrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
} 