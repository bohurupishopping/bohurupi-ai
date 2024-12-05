'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/global/ui/dialog";
import { ScrollArea } from "@/app/global/ui/scroll-area";
import { Separator } from "@/app/global/ui/separator";
import { Badge } from "@/app/global/ui/badge";
import { Button } from "@/app/global/ui/button";
import { Order } from "@/app/types/order";
import { 
  Package, 
  Calendar, 
  User, 
  Truck, 
  ExternalLink,
  Download,
  MapPin,
  Phone,
  Mail,
  
  Clock,
  ShoppingBag,
  Link
} from "lucide-react";
import Image from "next/image";
import { formatDate, cn } from "@/lib/utils";
import { OrderTracking } from './OrderTracking';
import { useState } from 'react';

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case 'pending':
      return {
        variant: 'outline' as const,
        className: 'border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500/30'
      };
    case 'completed':
      return {
        variant: 'outline' as const,
        className: 'border-green-500/50 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'border-gray-500/50 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-500/30'
      };
  }
}

export function OrderDetailsDialog({ order, isOpen, onClose }: OrderDetailsDialogProps) {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  if (!order) return null;

  const statusBadge = getStatusBadgeStyles(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] sm:h-[85vh] p-0 mx-2 sm:mx-auto">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-gradient-to-b from-background/80 via-background/80 to-background/50 backdrop-blur-sm border-b z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                Order #{order.orderId}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm flex flex-wrap items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                <span className="font-medium">{order.customerName}</span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span>{formatDate(order.createdAt)}</span>
              </DialogDescription>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge 
                variant={statusBadge.variant}
                className={cn("px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm", statusBadge.className)}
              >
                {order.status.toUpperCase()}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm",
                  order.orderstatus.toLowerCase() === 'cod'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white'
                )}
              >
                {order.orderstatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <section className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-violet-100/50 dark:border-violet-800/50">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                </div>
                {order.email && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.email}</p>
                  </div>
                )}
                {order.phone && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.phone}</p>
                  </div>
                )}
                {order.address && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.address}</p>
                  </div>
                )}
              </div>
            </section>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

            {/* Order Products */}
            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
                Order Products
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {order.products.map((product, index) => (
                  <div 
                    key={`${product.sku}-${index}`}
                    className="p-3 sm:p-4 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {product.image && (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                          <Image 
                            src={product.image} 
                            alt={product.details}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className="object-cover rounded-lg sm:rounded-xl shadow-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
                              {product.details}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              SKU: {product.sku}
                            </p>
                            <div className="mt-1 space-x-2 text-xs sm:text-sm">
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Color: {product.colour}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Size: {product.size}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Qty: {product.qty}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-semibold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                              ₹{product.sale_price}
                            </p>
                          </div>
                        </div>
                        {product.product_category && (
                          <div className="flex flex-wrap gap-2">
                            {product.product_category.split('|').map((category, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                              >
                                {category.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          {product.product_page_url && (
                            <a 
                              href={product.product_page_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
                            >
                              View Product <Link className="h-3 w-3" />
                            </a>
                          )}
                          {product.downloaddesign && (
                            <a 
                              href={product.downloaddesign}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
                            >
                              Download Design <Download className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

            {/* Order Timeline */}
            <section className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Clock className="h-5 w-5 text-amber-500" />
                Order Timeline
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-xl border border-amber-100/50 dark:border-amber-800/50">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Created At
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                {order.updatedAt && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Last Updated
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(order.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Shipping Information */}
            {order.trackingId && (
              <>
                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <section className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    Shipping Information
                  </h3>
                  <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-100/50 dark:border-green-800/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                      <div className="space-y-1.5">
                        <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Tracking ID
                        </div>
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">{order.trackingId}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 sm:h-9 text-xs sm:text-sm bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 flex-1 sm:flex-none"
                          onClick={() => window.open(`https://www.delhivery.com/track-v2/package/${order.trackingId}`, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span className="hidden sm:inline">Track on Delhivery</span>
                          <span className="sm:hidden">Track</span>
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex-1 sm:flex-none"
                          onClick={() => setIsTrackingOpen(true)}
                        >
                          <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span className="hidden sm:inline">View Tracking</span>
                          <span className="sm:hidden">Status</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Tracking Dialog */}
        {order.trackingId && (
          <OrderTracking
            trackingId={order.trackingId}
            isOpen={isTrackingOpen}
            onClose={() => setIsTrackingOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 