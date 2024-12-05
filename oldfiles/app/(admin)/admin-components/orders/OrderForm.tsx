'use client';
import { Order } from '@/app/types/order';
import { Button } from "@/app/global/ui/button";
import { Input } from "@/app/global/ui/input";
import { useToast } from "@/app/global/ui/use-toast";
import { Loader2, Link } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Product interface for type checking
interface OrderProduct {
  details: string;
  image: string;
  orderName: string;
  sku: string;
  sale_price: number;
  product_page_url: string;
  product_category: string;
  colour: string;
  size: string;
  qty: number;
}

// WooCommerce API response types
interface WooLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: any[];
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
    display_key: string;
    display_value: string;
  }>;
  sku: string;
  price: string;
}

interface WooProduct {
  id: number;
  name: string;
  permalink: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface WooOrder {
  number: string;
  payment_method: string;
  billing: {
    first_name: string;
    last_name: string;
  };
  line_items: WooLineItem[];
}

// Simplified form data interface
interface ExtendedFormData {
  orderId: string;
  status: 'pending' | 'completed';
  orderstatus: string;
  customerName: string;
  trackingId?: string;
  designUrl?: string;
  products: OrderProduct[];
}

interface OrderFormProps {
  initialData: Order | null;
  onSubmit: (data: Partial<Order>) => Promise<void>;
  onCancel: () => void;
}

export const OrderForm = ({ initialData, onSubmit, onCancel }: OrderFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [orderSearchError, setOrderSearchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExtendedFormData>({
    orderId: initialData?.orderId || '',
    status: initialData?.status || 'pending',
    orderstatus: initialData?.orderstatus || 'Prepaid',
    customerName: initialData?.customerName || '',
    trackingId: initialData?.trackingId || '',
    designUrl: initialData?.designUrl || '',
    products: initialData?.products || []
  });

  // Simplified handleChange for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add fetchOrderDetails function
  const fetchOrderDetails = async (orderId: string) => {
    if (!orderId) return;
    
    setIsLoadingOrder(true);
    setOrderSearchError(null);

    try {
      const response = await fetch(`/api/woocommerce/orders/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      const wooOrder: WooOrder = data;

      // Fetch additional product details for each line item
      const productsWithDetails = await Promise.all(
        wooOrder.line_items.map(async (item: WooLineItem) => {
          try {
            // Fetch product details from WooCommerce
            const productResponse = await fetch(`/api/woocommerce/products/${item.product_id}/`);
            if (!productResponse.ok) {
              console.error(`Failed to fetch product ${item.product_id}:`, await productResponse.text());
              // Return basic product info if detailed fetch fails
              return {
                details: item.name,
                image: '',
                orderName: item.name,
                sku: item.sku,
                sale_price: parseFloat(item.total) / item.quantity,
                product_page_url: '',
                product_category: '',
                colour: item.meta_data?.find(meta => 
                  meta.key.toLowerCase().includes('color') || 
                  meta.key.toLowerCase().includes('colour')
                )?.value || 'Black',
                size: item.meta_data?.find(meta => 
                  meta.key.toLowerCase().includes('size')
                )?.value || '',
                qty: item.quantity
              };
            }
            
            const productData: WooProduct = await productResponse.json();

            return {
              details: item.name,
              image: productData.images[0]?.src || '',
              orderName: item.name,
              sku: item.sku,
              sale_price: parseFloat(item.total) / item.quantity,
              product_page_url: productData.permalink || '',
              product_category: productData.categories?.map((cat: { name: string }) => cat.name).join(' | ') || '',
              colour: item.meta_data?.find(meta => 
                meta.key.toLowerCase().includes('color') || 
                meta.key.toLowerCase().includes('colour')
              )?.value || 'Black',
              size: item.meta_data?.find(meta => 
                meta.key.toLowerCase().includes('size')
              )?.value || '',
              qty: item.quantity
            };
          } catch (error) {
            console.error(`Error fetching product ${item.product_id}:`, error);
            // Return basic product info if fetch fails
            return {
              details: item.name,
              image: '',
              orderName: item.name,
              sku: item.sku,
              sale_price: parseFloat(item.total) / item.quantity,
              product_page_url: '',
              product_category: '',
              colour: item.meta_data?.find(meta => 
                meta.key.toLowerCase().includes('color') || 
                meta.key.toLowerCase().includes('colour')
              )?.value || 'Black',
              size: item.meta_data?.find(meta => 
                meta.key.toLowerCase().includes('size')
              )?.value || '',
              qty: item.quantity
            };
          }
        })
      );

      // Update form data with WooCommerce order details
      setFormData(prev => ({
        ...prev,
        orderId: wooOrder.number,
        orderstatus: wooOrder.payment_method === 'cod' ? 'COD' : 'Prepaid',
        customerName: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
        products: productsWithDetails
      }));

      toast({
        title: "Order Found",
        description: `Found ${wooOrder.line_items.length} products in this order`,
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Order not found or error occurred';
      setOrderSearchError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData: Partial<Order> = {
        orderId: formData.orderId,
        status: formData.status,
        orderstatus: formData.orderstatus,
        customerName: formData.customerName,
        trackingId: formData.trackingId,
        designUrl: formData.designUrl,
        products: formData.products
      };
      await onSubmit(orderData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialData && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Enter WooCommerce Order ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button
              type="button"
              onClick={() => fetchOrderDetails(searchQuery)}
              disabled={isLoadingOrder}
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              {isLoadingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Search Order'
              )}
            </Button>
          </div>
          {orderSearchError && (
            <p className="text-sm text-red-500">{orderSearchError}</p>
          )}
        </div>
      )}

      {/* Basic Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium">
            Order ID
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            readOnly
          />
        </div>
      </div>

      {/* Additional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderstatus" className="block text-sm font-medium">
            Payment Status
          </label>
          <select
            id="orderstatus"
            name="orderstatus"
            value={formData.orderstatus}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Prepaid">Prepaid</option>
            <option value="COD">COD</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Order Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="designUrl" className="block text-sm font-medium">
            Design URL
          </label>
          <input
            type="text"
            id="designUrl"
            name="designUrl"
            value={formData.designUrl}
            onChange={handleChange}
            placeholder="Enter design URL"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="trackingId" className="block text-sm font-medium">
            Tracking/AWB Number
          </label>
          <input
            type="text"
            id="trackingId"
            name="trackingId"
            value={formData.trackingId}
            onChange={handleChange}
            placeholder="Enter tracking number"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Products Preview Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Products</h3>
        {formData.products.map((product, index) => (
          <div 
            key={`${product.sku}-${index}`}
            className="p-4 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {product.image && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image 
                    src={product.image} 
                    alt={product.details}
                    fill
                    sizes="96px"
                    className="object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-base">{product.details}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                    <div className="mt-1 space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Color: {product.colour}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Size: {product.size}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Qty: {product.qty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                      ₹{product.sale_price}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.product_category.split('|').map((category, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                    >
                      {category.trim()}
                    </span>
                  ))}
                </div>
                <a 
                  href={product.product_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
                >
                  View Product <Link className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Order'
          )}
        </Button>
      </div>
    </form>
  );
}; 