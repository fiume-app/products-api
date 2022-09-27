import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { PRODUCTS_SCHEMA } from './types';

const products_schema = new Schema<PRODUCTS_SCHEMA>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  description: {
    type: SchemaTypes.String,
    required: true,
  },
  min_purchasable: {
    type: SchemaTypes.Number,
    required: true,
  },
  max_purchasable: {
    type: SchemaTypes.Number,
    required: true,
  },
  images: [
    {
      image: {
        type: SchemaTypes.String,
        required: true,
      },
      id: {
        type: SchemaTypes.String,
        required: true,
      },
    },
  ],
  purchasable: {
    type: SchemaTypes.Boolean,
    required: true,
  },
  quarantined: {
    type: SchemaTypes.Boolean,
    required: true,
  },
  banned: {
    type: SchemaTypes.Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

export const products = db.model<PRODUCTS_SCHEMA>(
  'products',
  products_schema,
);
