'use client';

import { Order } from '@/app/types/order';
import { motion } from 'framer-motion';
import { Edit2, ExternalLink, Package, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../../global/ui/button';
import { Card } from '../../../global/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/global/ui/alert-dialog";

export interface OrderTableProps {
  orders: Order[];
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: 'pending' | 'completed') => void;
  readOnly?: boolean;
}

export const OrderTable = ({ orders, onEdit, onDelete, readOnly }: OrderTableProps) => {
  const handleDelete = async (orderId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete(orderId);
    }
  };

  const handleEdit = (order: Order) => {
    if (onEdit) {
      onEdit(order);
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="animate-in"
        >
          <Card className="p-3 sm:p-4 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:border-gray-200 dark:hover:border-gray-700">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-4">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-1">
                    <span className="text-gray-500">#</span>
                    {order.orderId}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {order.customerName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                    ${order.orderstatus === 'COD' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {order.orderstatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                    ${order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {!readOnly && onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
                    onClick={() => handleEdit(order)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                )}
                {order.trackingId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
                    onClick={() => window.open(`https://track.delhivery.com/p/${order.trackingId}`, '_blank')}
                  >
                    <Package className="w-3.5 h-3.5 mr-1.5" />
                    Track
                  </Button>
                )}
                {!readOnly && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete order #{order.orderId}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDelete(order.id!, e)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {order.products?.map((product, index) => (
                <div 
                  key={`${product.sku}-${index}`} 
                  className="flex items-start sm:items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2"
                >
                  {product.image && (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.details}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between">
                      <p className="font-medium truncate text-xs sm:text-sm">{product.details}</p>
                      {product.product_page_url && (
                        <a
                          href={product.product_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      <span>SKU: {product.sku}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>Qty: {product.qty}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>₹{product.sale_price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.colour && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200/70 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {product.colour}
                        </span>
                      )}
                      {product.size && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200/70 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {product.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-8 sm:py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-400 mb-3" />
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">No orders found</h3>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            We couldn't find any orders matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTable; 