import { Document } from 'mongoose';

export interface PRODUCTS_SCHEMA extends Document {
  name: string,
  description: string,
  min_purchasable: number,
  max_purchasable: number,
  images: {
    image: string,
    id: string,
  }[],
  purchasable: boolean,
  quarantined: boolean,
  banned: boolean,
}
