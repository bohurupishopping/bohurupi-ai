'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/global/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/global/ui/tabs";
import { cn } from "@/lib/utils";

interface OrderTrendsProps {
  _data: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  className?: string;
}

export function OrderTrends({ _data, className }: OrderTrendsProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Order Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="space-y-4">
            {/* Add your chart component here */}
          </TabsContent>
          <TabsContent value="weekly" className="space-y-4">
            {/* Add your chart component here */}
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4">
            {/* Add your chart component here */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 