export interface Order {
  id?: string;
  orderId: string;
  status: 'pending' | 'completed';
  orderstatus: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  trackingId?: string;
  designUrl?: string;
  products: Array<{
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
    downloaddesign?: string;
  }>;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
} 