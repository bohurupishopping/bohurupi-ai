'use client'

import { useEffect, useState, useCallback } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import { Package, Clock, CheckCircle, IndianRupee } from 'lucide-react'
import { redirect } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb"

interface OrderData {
  customerName?: string;
  customerEmail?: string;
  orderName?: string;
  createdAt: string;
  sale_price?: number;
  qty?: number;
}

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  totalSpent: number;
  recentActivities: Array<{
    id: string;
    user: {
      name: string;
      email: string;
    };
    action: string;
    timestamp: string;
  }>;
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    completed: 0,
    totalSpent: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderStats = useCallback(async () => {
    if (!user?.email) {
      setError('Please login to view your dashboard')
      setLoading(false)
      return
    }

    try {
      const ordersRef = collection(db, 'orders')
      const userEmail = user.email

      // Fetch all orders
      const [pendingSnapshot, completedSnapshot] = await Promise.all([
        getDocs(query(
          ordersRef,
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        )),
        getDocs(query(
          ordersRef,
          where('status', '==', 'completed'),
          orderBy('createdAt', 'desc')
        ))
      ])

      // Calculate total spent from all completed orders
      let totalSpent = 0
      completedSnapshot.docs.forEach(doc => {
        const order = doc.data() as OrderData
        if (order.sale_price && order.qty) {
          totalSpent += (order.sale_price * order.qty)
        }
      })

      // Get recent activities
      const recentOrdersQuery = query(
        ordersRef,
        where('customerEmail', '==', userEmail),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      const recentSnapshot = await getDocs(recentOrdersQuery)
      
      const recentActivities = recentSnapshot.docs.map(doc => {
        const order = doc.data() as OrderData
        return {
          id: doc.id,
          user: {
            name: order.customerName || userEmail,
            email: userEmail
          },
          action: `Ordered ${order.orderName || 'Product'}`,
          timestamp: new Date(order.createdAt).toLocaleString()
        }
      })

      setOrderStats({
        total: pendingSnapshot.size + completedSnapshot.size,
        pending: pendingSnapshot.size,
        completed: completedSnapshot.size,
        totalSpent,
        recentActivities
      })
    } catch (err) {
      console.error('Error fetching order stats:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
    fetchOrderStats()
  }, [user, fetchOrderStats])

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
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)] m-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl shadow-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-4 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
          <div className="lg:sticky lg:top-20 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-4">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back, {user?.email?.split('@')[0]}
            </h1>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-xl pointer-events-none" />
            
            <div className="relative space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {orderStats.total}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Pending Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {orderStats.pending}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Completed Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {orderStats.completed}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-800/80">
                  <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Total Earnings
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{orderStats.totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {orderStats.recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 