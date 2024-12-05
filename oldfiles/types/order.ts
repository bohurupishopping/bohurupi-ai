export interface Order {
  id: string;
  orderName: string;
  customerName: string;
  deliveryDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
  details: string;
  colour: string;
  size: string;
  qty: number;
  orderstatus: string;
  courier: string;
  shipstatus: string;
  image?: string;
  downloaddesign?: string;
} 