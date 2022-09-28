import { Document } from 'mongoose';

export interface PATTERNS_SCHEMA extends Document {
  product_id: string,
  name: string,
  details: {
    key: string,
    value: string,
  }[],
  min_purchasable: number,
  max_purchasable: number,
  purchasable: boolean,
  quarantined: boolean,
  banned: boolean,
}
