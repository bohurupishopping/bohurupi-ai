'use client';

import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { 
  Truck, 
  Package, 
   
  Clock, 
  MapPin,
  AlertCircle,
  
  CalendarClock,
  CheckCheck,
  PackageCheck,
  PackageX,
  
  Building2,
  Warehouse,
  PackageSearch
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/global/ui/dialog";

interface TrackingStatus {
  Status: string;
  StatusDateTime: string;
  StatusLocation: string;
  Instructions: string;
}

interface TrackingScan {
  ScanDetail: {
    Scan: string;
    ScanDateTime: string;
    ScanLocation: string;
    Instructions: string;
  };
}

interface TrackingData {
  ShipmentData: Array<{
    Shipment: {
      Status: TrackingStatus;
      Scans: TrackingScan[];
      EstimatedDeliveryDate: string | null;
      PromisedDeliveryDate: string | null;
      ActualDeliveryDate: string | null;
    };
  }>;
}

interface OrderTrackingProps {
  trackingId: string;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusColor(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('delivered')) {
    return 'bg-gradient-to-br from-emerald-50/90 to-green-50/90 border-emerald-200/50 dark:from-emerald-950/50 dark:to-green-950/50 dark:border-emerald-800/50 shadow-sm shadow-emerald-100/50 dark:shadow-emerald-900/30';
  }
  if (statusLower.includes('transit')) {
    return 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-blue-200/50 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800/50 shadow-sm shadow-blue-100/50 dark:shadow-blue-900/30';
  }
  if (statusLower.includes('picked')) {
    return 'bg-gradient-to-br from-violet-50/90 to-purple-50/90 border-violet-200/50 dark:from-violet-950/50 dark:to-purple-950/50 dark:border-violet-800/50 shadow-sm shadow-violet-100/50 dark:shadow-violet-900/30';
  }
  if (statusLower.includes('pending')) {
    return 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/50 dark:from-amber-950/50 dark:to-yellow-950/50 dark:border-amber-800/50';
  }
  if (statusLower.includes('failed')) {
    return 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200/50 dark:from-rose-950/50 dark:to-red-950/50 dark:border-rose-800/50';
  }
  return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50 dark:from-gray-950/50 dark:to-slate-950/50 dark:border-gray-800/50';
}

function getStatusIcon(status: string) {
  const statusLower = status.toLowerCase();
  const iconClasses = "h-5 w-5 transition-all duration-500";
  
  if (statusLower.includes('delivered')) {
    return <CheckCheck className={cn(iconClasses, "text-emerald-500 dark:text-emerald-400 animate-bounce")} />;
  }
  if (statusLower.includes('transit')) {
    return <Truck className={cn(iconClasses, "text-blue-500 dark:text-blue-400 animate-pulse")} />;
  }
  if (statusLower.includes('picked')) {
    return <PackageCheck className={cn(iconClasses, "text-violet-500 dark:text-violet-400 animate-bounce")} />;
  }
  if (statusLower.includes('pending')) {
    return <PackageSearch className={cn(iconClasses, "text-amber-500 dark:text-amber-400 animate-pulse")} />;
  }
  if (statusLower.includes('failed')) {
    return <PackageX className={cn(iconClasses, "text-rose-500 dark:text-rose-400 animate-bounce")} />;
  }
  return <Package className={cn(iconClasses, "text-gray-500 dark:text-gray-400 animate-pulse")} />;
}

export function OrderTracking({ trackingId, isOpen, onClose }: OrderTrackingProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrackingData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/tracking?waybill=${trackingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tracking data');
        }
        const data = await response.json();
        setTrackingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tracking information');
      } finally {
        setLoading(false);
      }
    }

    if (trackingId && isOpen) {
      fetchTrackingData();
    }
  }, [trackingId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[90vh] sm:h-[85vh] p-0 mx-2 sm:mx-auto rounded-2xl overflow-hidden border-0">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-gradient-to-b from-background/95 via-background/90 to-background/80 backdrop-blur-xl border-b z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-pink-900/30 shadow-inner">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
              </div>
              Shipment Tracking
            </DialogTitle>
            <Badge 
              variant="outline" 
              className="px-2.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 border-violet-200/50 dark:border-violet-800/50 animate-pulse shadow-sm"
            >
              #{trackingId}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-3 sm:p-4 overflow-auto max-h-[calc(90vh-3rem)] sm:max-h-[calc(85vh-3rem)] bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          {loading ? (
            <div className="space-y-4 sm:space-y-6 animate-pulse">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800 mt-2" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200/50 bg-gradient-to-br from-red-50/50 to-rose-50/50 p-4 dark:from-red-950/50 dark:to-rose-950/50 dark:border-red-800/50">
              <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          ) : !trackingData?.ShipmentData[0]?.Shipment ? (
            <div className="rounded-xl border border-yellow-200/50 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 p-4 dark:from-yellow-950/50 dark:to-amber-950/50 dark:border-yellow-800/50">
              <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="font-medium text-sm sm:text-base">No tracking information available</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Current Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl border p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
                  getStatusColor(trackingData.ShipmentData[0].Shipment.Status.Status)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    {getStatusIcon(trackingData.ShipmentData[0].Shipment.Status.Status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          {trackingData.ShipmentData[0].Shipment.Status.Status}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {trackingData.ShipmentData[0].Shipment.Status.StatusLocation || 'Location not available'}
                        </div>
                      </div>
                      <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(trackingData.ShipmentData[0].Shipment.Status.StatusDateTime).toLocaleString()}
                      </time>
                    </div>
                    {trackingData.ShipmentData[0].Shipment.Status.Instructions && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/10 rounded-lg p-2">
                        {trackingData.ShipmentData[0].Shipment.Status.Instructions}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Estimated Delivery */}
              {trackingData.ShipmentData[0].Shipment.EstimatedDeliveryDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-blue-100/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-violet-50/80 p-3 sm:p-4 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-violet-950/50 dark:border-blue-800/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/30">
                      <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-blue-900 dark:text-blue-100">
                        Estimated Delivery
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                        {new Date(trackingData.ShipmentData[0].Shipment.EstimatedDeliveryDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tracking Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 sm:space-y-4 rounded-2xl border border-gray-100/50 dark:border-gray-800/50 p-3 sm:p-4 bg-gradient-to-br from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-900/50 backdrop-blur-sm"
              >
                <h4 className="text-sm sm:text-base font-medium bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-pink-900/30">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  Tracking History
                </h4>

                <div className="space-y-3">
                  {trackingData.ShipmentData[0].Shipment.Scans.map((scan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-6 pb-3 last:pb-0"
                    >
                      {/* Enhanced timeline styling */}
                      {index !== trackingData.ShipmentData[0].Shipment.Scans.length - 1 && (
                        <div className="absolute left-[11px] top-3 h-full w-px bg-gradient-to-b from-violet-200 via-purple-200 to-pink-200 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800" />
                      )}
                      
                      {/* Enhanced timeline dots */}
                      <div className={cn(
                        "absolute left-0 top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm",
                        index === 0 
                          ? "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 dark:from-violet-900/20 dark:to-purple-900/20 dark:border-violet-800" 
                          : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 dark:from-gray-900/50 dark:to-gray-800/50 dark:border-gray-800"
                      )}>
                        {index === 0 ? (
                          <Building2 className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                        ) : (
                          <Warehouse className="h-3 w-3 text-gray-400" />
                        )}
                      </div>

                      {/* Enhanced content styling */}
                      <div className="ml-3 rounded-xl border border-gray-100/50 bg-gradient-to-br from-gray-50/90 to-white/90 p-2.5 sm:p-3 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-800/50 transition-all duration-200 hover:shadow-md backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                              {scan.ScanDetail.Scan}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              {scan.ScanDetail.ScanLocation || 'Location not available'}
                            </div>
                          </div>
                          <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {new Date(scan.ScanDetail.ScanDateTime).toLocaleString()}
                          </time>
                        </div>
                        {scan.ScanDetail.Instructions && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/10 rounded-lg p-2">
                            {scan.ScanDetail.Instructions}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 