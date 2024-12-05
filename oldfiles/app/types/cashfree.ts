export interface CashfreePayment {
  cf_payment_id: number;
  payment_status: string;
  payment_message: string;
  payment_time: string;
  bank_reference: string;
  payment_method: {
    card?: {
      channel: string;
      card_number: string;
      card_network: string;
      card_type: string;
      card_bank_name: string;
    };
    upi?: {
      channel: string;
      upi_id: string;
    };
    netbanking?: {
      channel: string;
      bank_name: string;
      bank_reference: string;
    };
  };
}

export interface CashfreeOrder {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string;
    notify_url: string;
  };
  payment_session_id: string;
  payments: CashfreePayment[];
  refunds: any[];
  settlements: any[];
}

export interface CashfreeOrderResponse {
  cart_details: {
    cart_id: string;
  };
  cf_order_id: string;
  created_at: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_uid: string | null;
  };
  entity: string;
  order_amount: number;
  order_currency: string;
  order_expiry_time: string;
  order_id: string;
  order_meta: {
    return_url: string;
    notify_url: string;
    payment_methods: string | null;
  };
  order_note: string;
  order_splits: any[];
  order_status: string;
  order_tags: any | null;
  payment_session_id: string;
  terminal_data: any | null;
} 