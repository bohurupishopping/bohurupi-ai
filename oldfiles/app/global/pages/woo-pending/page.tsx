'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  collection, 
  query, 
  getDocs, 
  where, 
  orderBy, 
  CollectionReference,
  limit
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { OrderTable } from '@/app/global/components/OrderTable';
import type { Order } from '@/app/types/order';
import { Sidebar as AdminSidebar } from '@/app/global/components/Sidebar';
import { UserSidebar } from '@/app/user/user-components/user-sidebar';
import {
  LayoutDashboard,
  ShoppingBag,
 
  Wand2,
  Users,

  Package2,

  CheckCircle2
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb";
import { redirect } from 'next/navigation';

// Use the same menu items as admin layout
const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: 'Create Order',
    href: '/admin/orders',
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    title: "WooCommerce Orders",
    href: "/admin/woo-orders",
    icon: <ShoppingBag className="h-4 w-4" />
  },
  {
    title: "Pending Orders",
    href: "/global/pages/woo-pending",
    icon: <Package2 className="h-4 w-4" />,
  },
  {
    title: "Completed Orders",
    href: "/global/pages/woo-completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
];

const supportItems = [
  {
    title: 'Customer Support',
    href: '/admin/support',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'AI Tools',
    href: '/admin/ai-tools',
    icon: <Wand2 className="h-4 w-4" />,
  },
];

interface FirestoreOrder extends Omit<Order, 'id'> {
  orderName: string;
  customerName: string;
  deliveryDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
  details: string;
  colour: string;
  size: string;
  qty: number;
}

export default function PendingOrders() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      redirect('/login');
    }
  }, [user]);

  const fetchPendingOrders = useCallback(async () => {
    if (!user) {
      setError('Please login to view orders');
      setLoading(false);
      return;
    }

    try {
      const ordersRef = collection(db, 'orders') as CollectionReference<FirestoreOrder>;
      const ordersQuery = query(
        ordersRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(ordersQuery);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center m-4">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
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

  const MainContent = () => (
    <div className="min-h-[calc(100vh-2rem)] m-4 space-y-4 sm:space-y-6 relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5" />
      
      <div className="relative space-y-4 sm:space-y-6">
        <Breadcrumb className="z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" isHome>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pending Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-4 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
          <div className="lg:sticky lg:top-20 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-4">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pending Orders
            </h1>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-xl pointer-events-none" />
            
            <div className="relative overflow-hidden rounded-xl">
              <OrderTable 
                orders={orders}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Separate layout wrapper based on user role
  const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    // Type guard for user role
    const isAdmin = user?.role === 'admin';

    if (isAdmin) {
      return (
        <div className="flex min-h-screen">
          <AdminSidebar
            mainItems={menuItems}
            supportItems={supportItems}
            currentPath={pathname}
          />
          <div className="flex-1">
            {children}
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 pointer-events-none" />
        <UserSidebar />
        <main className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    );
  };

  return (
    <LayoutWrapper>
      <MainContent />
    </LayoutWrapper>
  );
} 