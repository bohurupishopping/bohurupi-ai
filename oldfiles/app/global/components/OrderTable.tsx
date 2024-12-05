'use client';

import { useState } from 'react';
import { Order } from '@/app/types/order';
import { motion } from 'framer-motion';
import { ExternalLink, Package, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { OrderTracking } from './OrderTracking';
import { cn, formatDate } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
}

// Helper function to get badge variant and styles based on status
function getStatusBadgeStyles(status: string) {
  switch (status) {
    case 'pending':
      return {
        variant: 'outline' as const,
        className: 'bg-gradient-to-r from-yellow-500 to-amber-500 border-0 text-white dark:from-yellow-600 dark:to-amber-600'
      };
    case 'completed':
      return {
        variant: 'outline' as const,
        className: 'bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white dark:from-green-600 dark:to-emerald-600'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'bg-gradient-to-r from-gray-500 to-slate-500 border-0 text-white dark:from-gray-600 dark:to-slate-600'
      };
  }
}

function getOrderStatusBadgeStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'cod':
      return 'bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white';
    case 'prepaid':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500 border-0 text-white';
  }
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingId, setTrackingId] = useState<string>('');

  const handleTrackOrder = (trackingId: string) => {
    setTrackingId(trackingId);
    setIsTrackingOpen(true);
  };

  return (
    <>
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <OrderTracking
        trackingId={trackingId}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <div className="space-y-3 sm:space-y-4">
        {orders.map((order, index) => {
          const statusBadge = getStatusBadgeStyles(order.status);
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="animate-in"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:border-gray-200 dark:hover:border-gray-700">
                {/* Order Header */}
                <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center justify-between sm:flex-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold flex items-center gap-1 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                          <span className="text-gray-400">#</span>
                          {order.orderId}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:hidden">
                        <Badge 
                          variant={statusBadge.variant}
                          className={cn("capitalize px-2 py-0.5 text-xs", statusBadge.className)}
                        >
                          {order.status}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 text-xs",
                            getOrderStatusBadgeStyle(order.orderstatus)
                          )}
                        >
                          {order.orderstatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <Badge 
                          variant={statusBadge.variant}
                          className={cn("capitalize px-3 py-1 shadow-sm", statusBadge.className)}
                        >
                          {order.status}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "px-3 py-1 shadow-sm",
                            getOrderStatusBadgeStyle(order.orderstatus)
                          )}
                        >
                          {order.orderstatus}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm flex-1 sm:flex-none"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          View Details
                        </Button>
                        {order.trackingId && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm flex-1 sm:flex-none"
                              onClick={() => window.open(`https://www.delhivery.com/track-v2/package/${order.trackingId}`, '_blank')}
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                              <span className="hidden sm:inline">Track on Delhivery</span>
                              <span className="sm:hidden">Track</span>
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="h-7 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm flex-1 sm:flex-none"
                              onClick={() => handleTrackOrder(order.trackingId!)}
                            >
                              <Package className="w-3.5 h-3.5 mr-1.5" />
                              <span className="hidden sm:inline">View Tracking</span>
                              <span className="sm:hidden">Status</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-3 sm:p-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    {order.products.map((product, productIndex) => (
                      <div 
                        key={`${product.sku}-${productIndex}`} 
                        className={cn(
                          "flex items-start gap-2 sm:gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm",
                          order.products.length === 1 && "sm:col-span-2"
                        )}
                      >
                        {product.image && (
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Image
                              src={product.image}
                              alt={product.details}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm text-gray-900 dark:text-gray-100">
                            {product.details}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs bg-white dark:bg-gray-900 shadow-sm">
                              SKU: {product.sku}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white dark:bg-gray-900 shadow-sm">
                              Qty: {product.qty}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white dark:bg-gray-900 shadow-sm">
                              ₹{product.sale_price}
                            </Badge>
                          </div>
                          {(product.colour || product.size) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.colour && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                                  {product.colour}
                                </span>
                              )}
                              {product.size && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                                  {product.size}
                                </span>
                              )}
                            </div>
                          )}
                          {product.product_category && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.product_category.split('|').map((category, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                >
                                  {category.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              No pending orders
            </h3>
            <p className="mt-1.5 sm:mt-2 text-sm text-gray-600 dark:text-gray-400">
              You don't have any pending orders at the moment.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderTable; 