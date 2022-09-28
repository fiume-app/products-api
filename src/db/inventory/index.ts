import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { INVENTORY_SCHEMA } from './types';

const inventory_schema = new Schema<INVENTORY_SCHEMA>({
  pattern_id: {
    type: SchemaTypes.String,
    required: true,
  },
  product_id: {
    type: SchemaTypes.String,
    required: true,
  },
  notes: [
    {
      key: {
        type: SchemaTypes.String,
        required: true,
      },
      value: {
        type: SchemaTypes.String,
        required: true,
      },
    },
  ],
  status: {
    type: SchemaTypes.String,
    enum: [
      'sold',
      'ordered',
      'available',
      'returned',
    ],
    required: true,
  },
  order_id: {
    type: SchemaTypes.String,
    required: true,
  },
  purchasable: {
    type: SchemaTypes.Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

export const inventory = db.model<INVENTORY_SCHEMA>(
  'inventory',
  inventory_schema,
);
