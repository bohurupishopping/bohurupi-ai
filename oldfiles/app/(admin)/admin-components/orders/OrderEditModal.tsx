'use client';

import React from 'react'
import { createPortal } from 'react-dom';
import { OrderForm } from './OrderForm';
import { Order } from '@/app/types/order';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useToast } from "@/app/global/ui/use-toast";

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  onSubmit: (data: Partial<Order>) => Promise<void>;
}

const OrderEditModal = ({ isOpen, onClose, selectedOrder, onSubmit }: OrderEditModalProps) => {
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (data: Partial<Order>) => {
    if (data.trackingId) {
      const trackingPattern = /^[A-Z0-9]{8,15}$/;
      if (!trackingPattern.test(data.trackingId.trim())) {
        toast({
          title: "Invalid Tracking Number",
          description: "Please enter a valid Delhivery tracking number",
          variant: "destructive",
        });
        return;
      }
    }

    await onSubmit(data);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:py-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl relative mx-auto my-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Header */}
            <div className="mb-4 sm:mb-6 pr-8 sm:pr-10">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                {selectedOrder ? 'Edit Order' : 'Create New Order'}
              </h2>
            </div>

            {/* Form Container with dynamic max height */}
            <div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-16rem)] overflow-y-auto">
              <OrderForm
                initialData={selectedOrder}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );

  // Use portal to render modal at the root level
  return createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body
  );
};

export default OrderEditModal; 