import { Order } from './order';

// Type for order without shipping-related fields
export type OrderWithoutShipping = Omit<Order, 'courier' | 'shipstatus'> & { trackingId?: string }; 