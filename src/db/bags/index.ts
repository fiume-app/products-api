import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { BAGS_SCHEMA } from './types';

const bags_schema = new Schema<BAGS_SCHEMA>({
  buyer_id: {
    type: SchemaTypes.String,
    required: true,
  },
  product_id: {
    type: SchemaTypes.String,
    required: true,
  },
  pattern_id: {
    type: SchemaTypes.String,
    required: true,
  },
  address_id: {
    type: SchemaTypes.String,
    required: true,
  },
  qty: {
    type: SchemaTypes.Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const bags = db.model<BAGS_SCHEMA>(
  'bags',
  bags_schema,
);
