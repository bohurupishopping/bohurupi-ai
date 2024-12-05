'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
   
  Wand2,
  Users,
  
  Package2,
  
  CheckCircle2
} from 'lucide-react';
import { Sidebar } from '../../global/components/Sidebar';
import { ScrollArea } from '../../global/ui/scroll-area';
import Image from 'next/image';

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isPendingOrdersRoute = pathname.startsWith('/global/pages/woo-pending');
  const shouldShowSidebar = isAdminRoute || isPendingOrdersRoute;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/ai-icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && (
        <Sidebar 
          mainItems={menuItems}
          supportItems={supportItems}
          currentPath={pathname}
          className="hidden lg:block"
        />
      )}
      <div className="relative flex-1">
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="fixed inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5" />
        <ScrollArea className="h-full relative">
          <main className="flex-1 relative">
            {children}
          </main>
        </ScrollArea>
      </div>

      <div id="modal-root" />
    </div>
  );
} 