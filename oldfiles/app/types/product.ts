export interface Product {
  id?: string;
  post_title: string;
  sku: string;
  sale_price: number;
  images: string;
  product_page_url: string;
  "tax:product_cat": string;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
} 