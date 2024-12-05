'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  collection, 
  query, 
  getDocs, 
  where, 
  orderBy, 
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  CollectionReference,
  DocumentReference,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { OrderTable, OrderFilter, OrderEditModal } from '@/app/(admin)/admin-components/orders';
import type { Order } from '@/app/types/order';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb";
import { useToast } from "@/app/global/ui/use-toast";

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
  orderstatus: string;
  courier: string;
  shipstatus: string;
  image?: string;
  downloaddesign?: string;
  sku: string;
  sale_price: number;
  product_page_url: string;
  product_category: string;
}

export default function OrdersManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    try {
      const ordersRef = collection(db, 'orders') as CollectionReference<FirestoreOrder>;
      let ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(100));

      if (statusFilter !== 'all') {
        ordersQuery = query(ordersRef, 
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
      }

      const snapshot = await getDocs(ordersQuery);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'completed') => {
    try {
      if (!orderId) throw new Error('Order ID is required');
      
      const orderRef = doc(db, 'orders', orderId) as DocumentReference<FirestoreOrder>;
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      if (!orderId) throw new Error('Order ID is required');
      
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const handleSaveOrder = async (orderData: Partial<Order>) => {
    setLoading(true);

    try {
      const data = {
        ...orderData,
        createdAt: Timestamp.now().toDate().toISOString(),
      };

      if (selectedOrder?.id) {
        const orderRef = doc(db, 'orders', selectedOrder.id) as DocumentReference<FirestoreOrder>;
        await updateDoc(orderRef, data);
        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? { ...data, id: selectedOrder.id } as Order : order
        ));
      } else {
        const docRef = await addDoc(collection(db, 'orders'), data);
        setOrders([{ ...data, id: docRef.id } as Order, ...orders]);
      }

      setIsEditModalOpen(false);
      setSelectedOrder(null);
      
      toast({
        title: "Success",
        description: "Order saved successfully",
      });
    } catch (err) {
      console.error('Error saving order:', err);
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-[calc(100vh-2rem)] m-4 space-y-4 sm:space-y-6 relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-sky-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5" />
      
      <div className="relative space-y-4 sm:space-y-6">
        <Breadcrumb className="z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" isHome>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-4 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
          <div className="lg:sticky lg:top-20 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-4">
            <OrderFilter 
              statusFilter={statusFilter}
              onFilterChange={(status) => setStatusFilter(status)}
              onAddNew={() => setIsEditModalOpen(true)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-xl pointer-events-none" />
            
            <div className="relative overflow-hidden rounded-xl">
              <OrderTable 
                orders={orders}
                onEdit={(order) => {
                  setSelectedOrder(order);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteOrder}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <OrderEditModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
          }}
          selectedOrder={selectedOrder}
          onSubmit={handleSaveOrder}
        />
      )}
    </div>
  );
} 