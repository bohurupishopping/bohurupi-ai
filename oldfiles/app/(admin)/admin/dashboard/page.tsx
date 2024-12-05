'use client';

import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  Package,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { db } from '@/app/lib/firebase';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { MetricCard } from "@/app/(admin)/admin-components/dashboard/metric-card";
import { RecentActivities } from "@/app/(admin)/admin-components/dashboard/recent-activities";
import { OrderTrends } from "@/app/(admin)/admin-components/dashboard/order-trends";

// Add interfaces for type safety
interface DashboardActivity {
  id: string;
  user: {
    name: string;
    email: string;
  };
  action: string;
  timestamp: string;
}

interface DashboardMetrics {
  totalRevenue: number;
  newOrders: number;
  activeOrders: number;
  totalProducts: number;
  recentActivities: DashboardActivity[];
}

export default function DashboardPage() {
  // Update state with proper typing
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    newOrders: 0,
    activeOrders: 0,
    totalProducts: 0,
    recentActivities: []
  });

  const fetchMetrics = async () => {
    try {
      // Fetch products count
      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      const totalProducts = productsSnap.size;

      // Fetch orders
      const ordersRef = collection(db, 'orders');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // New orders (last 24 hours)
      const newOrdersQuery = query(
        ordersRef,
        where('createdAt', '>=', today),
        orderBy('createdAt', 'desc')
      );
      const newOrdersSnap = await getDocs(newOrdersQuery);
      const newOrders = newOrdersSnap.size;

      // Active orders
      const activeOrdersQuery = query(
        ordersRef,
        where('status', '==', 'pending')
      );
      const activeOrdersSnap = await getDocs(activeOrdersQuery);
      const activeOrders = activeOrdersSnap.size;

      // Calculate total revenue from completed orders
      const completedOrdersQuery = query(
        ordersRef,
        where('status', '==', 'completed')  // Only get completed orders
      );
      const completedOrdersSnap = await getDocs(completedOrdersQuery);
      
      let totalRevenue = 0;
      completedOrdersSnap.forEach(doc => {
        const order = doc.data();
        if (order.sale_price && order.qty) {
          totalRevenue += (order.sale_price * order.qty);
        }
      });

      // Log revenue calculation for debugging
      console.log('Revenue calculation:', {
        completedOrdersCount: completedOrdersSnap.size,
        totalRevenue,
        orderDetails: completedOrdersSnap.docs.map(doc => {
          const order = doc.data();
          return {
            id: doc.id,
            price: order.sale_price,
            qty: order.qty,
            total: order.sale_price * order.qty
          };
        })
      });

      // Recent activities
      const recentActivitiesQuery = query(
        ordersRef,
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const recentActivitiesSnap = await getDocs(recentActivitiesQuery);
      const recentActivities: DashboardActivity[] = recentActivitiesSnap.docs.map(doc => {
        const order = doc.data();
        let timestamp = new Date().toLocaleString();

        // Handle different timestamp formats
        if (order.createdAt) {
          if (typeof order.createdAt.toDate === 'function') {
            // Firestore Timestamp
            timestamp = order.createdAt.toDate().toLocaleString();
          } else if (order.createdAt instanceof Date) {
            // JavaScript Date
            timestamp = order.createdAt.toLocaleString();
          } else if (typeof order.createdAt === 'string') {
            // ISO String or other string format
            timestamp = new Date(order.createdAt).toLocaleString();
          }
        }

        return {
          id: doc.id,
          user: {
            name: order.customerName || 'Unknown',
            email: order.customerEmail || '',
          },
          action: `Ordered ${order.details || 'Unknown Product'}`,
          timestamp
        };
      });

      setMetrics({
        totalRevenue,
        newOrders,
        activeOrders,
        totalProducts,
        recentActivities
      });

      // Debug log
      console.log('Metrics updated:', {
        totalRevenue,
        newOrders,
        activeOrders,
        totalProducts,
        recentActivitiesCount: recentActivities.length
      });

    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Set up real-time listener or polling here if needed
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 relative">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5" />
      
      {/* Content with backdrop blur */}
      <div className="relative space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-indigo-600 dark:from-blue-100 dark:to-indigo-300 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Metrics grid - keeping original styling */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
            icon={<CircleDollarSign />}
            trend={{ value: 12.2, positive: true }}
            color="violet"
          />
          <MetricCard
            title="New Orders"
            value={metrics.newOrders}
            icon={<ShoppingCart />}
            trend={{ value: 5.1, positive: true }}
            color="pink"
          />
          <MetricCard
            title="Active Orders"
            value={metrics.activeOrders}
            icon={<Package />}
            description="Orders pending delivery"
            color="blue"
          />
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts}
            icon={<TrendingUp />}
            description="Products in catalog"
            color="green"
          />
        </div>

        {/* Charts and Activities grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <OrderTrends
            _data={{
              daily: [/* your data */],
              weekly: [/* your data */],
              monthly: [/* your data */]
            }}
            className="lg:col-span-4 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 backdrop-blur-sm"
          />
          <RecentActivities
            activities={metrics.recentActivities}
            className="lg:col-span-3 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
} 