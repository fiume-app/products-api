import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { ORDERS_SCHEMA } from './types';

const orders_schema = new Schema<ORDERS_SCHEMA>({
  buyer_id: {
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
      'pending',
      'confirmed',
      'placed',
      'shipped',
      'out_for_delivery',
      'delivered',
    ],
    required: true,
  },
  payment_gateway: {
    type: SchemaTypes.String,
    required: true,
  },
  payment_status: {
    type: SchemaTypes.String,
    enum: [
      'pending',
      'paid',
      'failed',
    ],
    required: true,
  },
  gateway_details: {
    payment_id: {
      type: SchemaTypes.String,
    },
    order_id: {
      type: SchemaTypes.String,
    },
  },
}, {
  timestamps: true,
});

export const orders = db.model<ORDERS_SCHEMA>(
  'orders',
  orders_schema,
);
