import { Document } from 'mongoose';

export interface ADDRESSES_SCHEMA extends Document {
  buyer_id: string,
  line1: string,
  line2?: string,
  city: string,
  state: string,
  pin_code: string,
}
