'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../global/ui/LoadingSpinner';
import { Button } from '@/app/global/ui/button';
import { Input } from '@/app/global/ui/input';
import { useToast } from '@/app/global/ui/use-toast';
import { Toaster } from '@/app/global/ui/toaster';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, login, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-500/5 to-pink-500/5">
        <div className="relative">
          <div className="h-32 w-32 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500"></div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication not initialized",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userRole = await login(email, password);
      toast({
        title: "Success!",
        description: "Logging you in...",
      });
      const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      console.error('Login error:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-pink-50 dark:from-background dark:via-background/95 dark:to-background/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-50/[0.05] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />

      <div className="w-full max-w-md space-y-8 px-4 relative">
        <motion.div 
          className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-card-foreground rounded-2xl border border-violet-100/50 dark:border-violet-500/10 shadow-[0_20px_50px_rgba(124,58,237,0.15)] dark:shadow-2xl dark:shadow-violet-500/10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(124,58,237,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo Section */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <motion.div 
              className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/90 to-pink-600/90 backdrop-blur-xl p-[2px] shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-full w-full rounded-[inherit] bg-gradient-to-br from-violet-600/90 to-pink-600/90 backdrop-blur-xl flex items-center justify-center">
                <Image
                  src="/assets/ai-icon.png"
                  alt="Bohurupi Logo"
                  width={64}
                  height={64}
                  className="object-cover transform hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="p-8 pt-16">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-700 to-pink-700 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to your account to continue
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-violet-100/50 dark:border-violet-500/20 transition-all duration-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 hover:border-violet-500/50 hover:bg-white/80 dark:hover:bg-gray-900/80"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-violet-100/50 dark:border-violet-500/20 transition-all duration-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 hover:border-violet-500/50 hover:bg-white/80 dark:hover:bg-gray-900/80"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="h-5 w-5 border-2" />
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </motion.form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            © 2024 Bohurupi. All rights reserved.
          </p>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage; 