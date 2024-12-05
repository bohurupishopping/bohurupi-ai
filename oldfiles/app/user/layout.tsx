'use client';

import { UserSidebar } from '@/app/user/user-components/user-sidebar'
import { useAuth } from '@/app/context/AuthContext'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import React from 'react'
import Image from 'next/image'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <div className="relative">
          <div className="h-32 w-32 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/ai-icon.png"
              alt="Bohurupi Logo"
              width={40}
              height={40}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  // Regular user layout for all pages (including global pages)
  return (
    <div className="flex min-h-screen relative">
      <div className="relative z-50">
        <UserSidebar />
      </div>
      <main className="flex-1 relative z-40">{children}</main>
    </div>
  );
} 