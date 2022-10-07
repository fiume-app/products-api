import { Document } from 'mongoose';

export interface ORDERS_SCHEMA extends Document {
  buyer_id: string,
  notes: {
    key: string,
    value: string,
  }[],
  status: 'pending' | 'confirmed' | 'placed' | 'shipped' | 'out_for_delivery' | 'delivered',
  payment_gateway: string,
  payment_status: 'pending' | 'paid' | 'failed',
  gateway_details: {
    payment_id: string,
    order_id: string,
  },
}
