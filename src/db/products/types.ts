import { Document } from 'mongoose';

export interface PRODUCTS_SCHEMA extends Document {
  name: string,
  description: string,
  min_purchasable: number,
  max_purchasable: number,
  purchasable: boolean,
  quarantined: boolean,
  banned: boolean,
  differentiators: [
    {
      key: string,
      header_leading_enabled: boolean,
      header_leading_type?: 'icon',
      header_leading_content?: string,
      header_title?: string,
      header_trailing_enabled: boolean,
      header_trailing_type?: 'link',
      header_trailing_content?: string,
      selector_type: 'image' | 'text',
      selector_shape: 'circle' | 'rectangle' | 'square' | 'rounded_rectangle',
    },
  ],
}
