'use client';

import { Plus, Filter, Package2 } from 'lucide-react';
import { Button } from '../../../global/ui/button';
import { motion } from 'framer-motion';

export interface OrderFilterProps {
  statusFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (status: 'all' | 'pending' | 'completed') => void;
  onAddNew: () => void;
}

export const OrderFilter = ({
  statusFilter,
  onFilterChange,
  onAddNew
}: OrderFilterProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 mb-6 sm:mb-8 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 p-4 sm:p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          <Package2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Manage and track all your orders in one place
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Status Filter */}
        <motion.div 
          className="relative flex-1 sm:flex-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value as typeof statusFilter)}
            className="w-full sm:w-[180px] h-9 sm:h-10 rounded-lg border bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50
              disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
              border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <Filter className="absolute right-3 top-2.5 sm:top-3 h-4 w-4 text-indigo-500 dark:text-indigo-400 pointer-events-none" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 sm:flex-none"
        >
          <Button 
            onClick={onAddNew}
            variant="default"
            size="default"
            className="w-full h-9 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add New Order
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderFilter; 