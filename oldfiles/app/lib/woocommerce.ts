import { WooCommerceOrder, WooCommerceProduct } from "../types/woocommerce";

class WooCommerceAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; total: number; totalPages: number }> {
    try {
      const response = await fetch(`/api/woocommerce/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`WooCommerce API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');

      return {
        data,
        total,
        totalPages
      };
    } catch (error) {
      console.error('WooCommerce API Request Failed:', error);
      throw error;
    }
  }

  // Orders Methods
  async getOrders(params: {
    context?: 'view' | 'edit';
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
    parent?: number[];
    parent_exclude?: number[];
    status?: string;
    customer?: number;
    product?: number;
    dp?: number;
  } = {}): Promise<{ orders: WooCommerceOrder[]; total: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const result = await this.request<WooCommerceOrder[]>(`orders?${queryParams.toString()}`);
    return {
      orders: result.data,
      total: result.total,
      totalPages: result.totalPages
    };
  }

  // Products Methods
  async getProducts(params: {
    context?: 'view' | 'edit';
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price';
    parent?: number[];
    parent_exclude?: number[];
    status?: string;
    type?: string;
    sku?: string;
    featured?: boolean;
    category?: string;
    tag?: string;
    shipping_class?: string;
    attribute?: string;
    attribute_term?: string;
    tax_class?: string;
    on_sale?: boolean;
    min_price?: string;
    max_price?: string;
    stock_status?: 'instock' | 'outofstock' | 'onbackorder';
  } = {}): Promise<{ products: WooCommerceProduct[]; total: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const result = await this.request<WooCommerceProduct[]>(`products?${queryParams.toString()}`);
    return {
      products: result.data,
      total: result.total,
      totalPages: result.totalPages
    };
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    const result = await this.request<WooCommerceProduct>(`products/${id}`);
    return result.data;
  }

  async updateProduct(id: number, data: Partial<WooCommerceProduct>): Promise<WooCommerceProduct> {
    const result = await this.request<WooCommerceProduct>(`products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data;
  }

  async deleteProduct(id: number): Promise<WooCommerceProduct> {
    const result = await this.request<WooCommerceProduct>(`products/${id}`, {
      method: 'DELETE',
    });
    return result.data;
  }

  // Existing Order Methods
  async getOrder(id: number): Promise<WooCommerceOrder> {
    const result = await this.request<WooCommerceOrder>(`orders/${id}`);
    return result.data;
  }

  async updateOrder(id: number, data: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    const result = await this.request<WooCommerceOrder>(`orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result.data;
  }

  async deleteOrder(id: number): Promise<WooCommerceOrder> {
    const result = await this.request<WooCommerceOrder>(`orders/${id}`, {
      method: 'DELETE',
    });
    return result.data;
  }
}

const api = new WooCommerceAPI();
export default api; 