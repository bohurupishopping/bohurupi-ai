'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
   
  
  Menu,
  LogOut,
  User,
  Settings,
  HelpCircle,
  CheckCircle2,
  Package2
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './user-ui/sheet'

import { useAuth } from '@/app/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from './user-ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './user-ui/dropdown-menu'
import { ScrollArea } from './user-ui/scroll-area'

import { cn } from '@/lib/utils'
import Image from 'next/image'

// Define interfaces for our menu structure
interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuSection {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  items?: MenuGroup[];
}

const menuItems: MenuSection[] = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Pending Orders",
    href: "/global/pages/woo-pending",
    icon: <Package2 className="h-5 w-5" />,
  },
  {
    title: "Completed Orders",
    href: "/global/pages/woo-completed",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
];

const supportItems: MenuItem[] = [
  {
    title: "Settings",
    href: "/user/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help",
    href: "/user/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

// Add interface for SidebarContent props
interface SidebarContentProps {
  className?: string;
}

export function UserSidebar(): JSX.Element {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const SidebarContent = ({ className }: SidebarContentProps): JSX.Element => (
    <div className={cn(
      "relative flex flex-col h-[100dvh] p-3 sm:p-4 z-50 pointer-events-auto",
      className
    )}>
      {/* Logo Section - Updated styling */}
      <div className="flex items-center gap-3 p-4 sm:p-6 mb-3 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-lg backdrop-blur-sm">
        <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl shadow-lg border-2 border-violet-500/20">
          <Image
            src="/assets/ai-icon.png"
            alt="Bohurupi Logo"
            width={44}
            height={44}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
            Bohurupi
          </h2>
          <p className="text-xs font-medium text-muted-foreground/80">User Dashboard</p>
        </div>
      </div>

      {/* Main Content Area - Updated styling */}
      <div className="flex-1 min-h-0 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-lg backdrop-blur-sm mb-3">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-6">
            {menuItems.map((section) => (
              <div key={section.title} className="space-y-2">
                {section.href ? (
                  // Single item like Dashboard - Updated styling
                  <Link href={section.href}>
                    <button
                      className={cn(
                        "w-full justify-start rounded-xl",
                        "transition-all duration-300 ease-in-out active:scale-95",
                        "hover:translate-x-1 hover:shadow-lg hover:shadow-violet-500/20",
                        "flex items-center gap-3 px-3 sm:px-4 py-3",
                        pathname === section.href
                          ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-700 dark:text-violet-300 shadow-md"
                          : "text-muted-foreground hover:bg-violet-500/10"
                      )}
                    >
                      {section.icon && (
                        <div className={cn(
                          "rounded-xl p-2 transition-all duration-300",
                          pathname === section.href 
                            ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md" 
                            : "text-muted-foreground bg-background/80"
                        )}>
                          {section.icon}
                        </div>
                      )}
                      <span className="font-medium">{section.title}</span>
                    </button>
                  </Link>
                ) : (
                  // Section with nested items - Updated styling
                  <>
                    <h3 className="px-2 text-xs font-semibold tracking-tight text-muted-foreground/70 uppercase">
                      {section.title}
                    </h3>
                    {section.items?.map((group) => (
                      <div key={group.title} className="space-y-1">
                        <h4 className="px-2 text-sm font-medium text-muted-foreground">
                          {group.title}
                        </h4>
                        <div className="space-y-1">
                          {group.items.map((item) => (
                            <Link key={item.href} href={item.href!}>
                              <button
                                className={cn(
                                  "w-full justify-start rounded-xl",
                                  "transition-all duration-300 ease-in-out active:scale-95",
                                  "hover:translate-x-1 hover:shadow-lg hover:shadow-violet-500/20",
                                  "flex items-center gap-3 px-3 sm:px-4 py-2",
                                  pathname === item.href
                                    ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-700 dark:text-violet-300"
                                    : "text-muted-foreground hover:bg-violet-500/10"
                                )}
                              >
                                {item.icon && (
                                  <div className={cn(
                                    "rounded-xl p-2",
                                    pathname === item.href 
                                      ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white" 
                                      : "text-muted-foreground bg-background/80"
                                  )}>
                                    {item.icon}
                                  </div>
                                )}
                                <span className="font-medium">{item.title}</span>
                              </button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Profile Section - Updated styling */}
      <div className="bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-lg backdrop-blur-sm p-3">
        <div className="rounded-xl bg-gradient-to-r from-violet-500/5 to-pink-500/5 p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full justify-start rounded-xl p-2.5 sm:p-3 hover:bg-background/80 flex items-center gap-3 transition-all duration-300 active:scale-95 touch-manipulation">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-violet-500/20 shadow-md">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.email || 'User avatar'} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-white font-semibold">
                    {user?.email ? getInitials(user.email.split('@')[0]) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold line-clamp-1">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground/80 line-clamp-1">
                    {user?.email || ''}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[240px] rounded-xl" 
              align="start"
              sideOffset={8}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/user/profile">
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-3">
                  <User className="h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600 rounded-lg py-3" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Added copyright section */}
        <div className="mt-4">
          <div className="rounded-xl bg-gradient-to-r from-violet-500/5 to-pink-500/5 p-3">
            <p className="text-xs text-muted-foreground/70 text-center font-medium">
              © 2024 Bohurupi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="fixed right-4 top-4 z-40 lg:hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 p-2 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Update z-index and ensure pointer events work */}
      <div className="hidden lg:block w-[280px] relative z-50 pointer-events-auto">
        <div className="fixed h-screen pointer-events-auto">
          <div className="relative h-full pointer-events-auto">
            {/* Background with blur and gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-900/20 dark:via-gray-900/10 dark:to-transparent backdrop-blur-md pointer-events-none" />
            
            {/* Content */}
            <div className="relative h-full pointer-events-auto">
              <SidebarContent 
                className="bg-transparent pointer-events-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}