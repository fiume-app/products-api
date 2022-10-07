import { Document } from 'mongoose';

export interface BAGS_SCHEMA extends Document {
  buyer_id: string,
  product_id: string,
  pattern_id: string,
  address_id: string,
  qty: number,
}
