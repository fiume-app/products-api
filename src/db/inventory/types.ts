import { Document } from 'mongoose';

export interface INVENTORY_SCHEMA extends Document {
  product_id: string,
  pattern_id: string,
  notes: {
    key: string,
    value: string,
  }[],
  status: 'sold' | 'ordered' | 'available' | 'returned',
  order_id: string,
  purchasable: boolean,
}
