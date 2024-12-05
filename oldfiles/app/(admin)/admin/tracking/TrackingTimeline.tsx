import { Card } from "@/app/global/ui/card";
import { Package, MapPin, CheckCircle2, AlertCircle, Truck, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingData {
  ShipmentData: Array<{
    Shipment: {
      Status: {
        Status: string;
        StatusDateTime: string;
        StatusLocation: string;
        Instructions: string;
      };
      Scans: Array<{
        ScanDetail: {
          Scan: string;
          ScanDateTime: string;
          ScanLocation: string;
          Instructions: string;
        };
      }>;
    };
  }>;
}

export interface TrackingTimelineProps {
  data: TrackingData;
}

function getStatusIcon(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('delivered')) return CheckCircle2;
  if (statusLower.includes('transit')) return Truck;
  if (statusLower.includes('pending')) return AlertCircle;
  if (statusLower.includes('picked')) return Box;
  return Package;
}

function getStatusStyles(status: string): {
  border: string;
  background: string;
  text: string;
  icon: string;
} {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('delivered')) {
    return {
      border: 'border-green-500',
      background: 'bg-green-50 dark:bg-green-500/10',
      text: 'text-green-500',
      icon: 'bg-green-100 dark:bg-green-500/20'
    };
  }
  if (statusLower.includes('transit')) {
    return {
      border: 'border-blue-500',
      background: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-500',
      icon: 'bg-blue-100 dark:bg-blue-500/20'
    };
  }
  if (statusLower.includes('pending')) {
    return {
      border: 'border-orange-500',
      background: 'bg-orange-50 dark:bg-orange-500/10',
      text: 'text-orange-500',
      icon: 'bg-orange-100 dark:bg-orange-500/20'
    };
  }
  if (statusLower.includes('exception')) {
    return {
      border: 'border-red-500',
      background: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-500',
      icon: 'bg-red-100 dark:bg-red-500/20'
    };
  }
  return {
    border: 'border-primary',
    background: 'bg-primary/5',
    text: 'text-primary',
    icon: 'bg-primary/10'
  };
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

export default function TrackingTimeline({ data }: TrackingTimelineProps) {
  if (!data?.ShipmentData?.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No tracking information available
        </div>
      </Card>
    );
  }

  const shipment = data.ShipmentData[0].Shipment;
  if (!shipment?.Status) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Invalid tracking data received
        </div>
      </Card>
    );
  }

  const currentStatus = shipment.Status;
  const scans = shipment.Scans || [];
  const StatusIcon = getStatusIcon(currentStatus.Status);
  const statusStyles = getStatusStyles(currentStatus.Status);
  const currentDateTime = formatDateTime(currentStatus.StatusDateTime);

  return (
    <Card className="p-6">
      {/* Current Status */}
      <div className={cn(
        "mb-8 p-6 rounded-lg border-2",
        "transition-all duration-300",
        "animate-fade-in",
        statusStyles.border,
        statusStyles.background
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-full",
            statusStyles.icon,
            statusStyles.text
          )}>
            <StatusIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentStatus.Status}</h2>
                <p className="text-lg text-muted-foreground">{currentStatus.StatusLocation}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{currentDateTime.date}</p>
                <p className="text-muted-foreground">{currentDateTime.time}</p>
              </div>
            </div>
            {currentStatus.Instructions && (
              <p className="mt-4 p-3 bg-background/80 rounded-lg text-sm">
                {currentStatus.Instructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="relative">
        <h3 className="text-lg font-semibold mb-6">Tracking History</h3>
        <div className="space-y-8">
          {scans.map((scan, index) => {
            const StatusIcon = getStatusIcon(scan.ScanDetail.Scan);
            const scanStyles = getStatusStyles(scan.ScanDetail.Scan);
            const dateTime = formatDateTime(scan.ScanDetail.ScanDateTime);
            
            return (
              <div 
                key={index} 
                className={cn(
                  "relative pl-8 animate-fade-in",
                  "transition-all duration-300 ease-in-out",
                  index !== scans.length - 1 && "border-l-2 border-primary/20"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -left-3 top-0">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    "transition-all duration-300",
                    scanStyles.icon,
                    scanStyles.text
                  )}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="bg-background/40 rounded-lg p-4 hover:bg-background/60 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{scan.ScanDetail.Scan}</p>
                    <div className="text-right text-sm">
                      <p className="font-medium">{dateTime.date}</p>
                      <p className="text-muted-foreground">{dateTime.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {scan.ScanDetail.ScanLocation}
                  </p>
                  {scan.ScanDetail.Instructions && (
                    <p className="mt-2 text-sm p-2 bg-background/60 rounded-md">
                      {scan.ScanDetail.Instructions}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
} 