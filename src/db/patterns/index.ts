import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { PATTERNS_SCHEMA } from './types';

const patterns_schema = new Schema<PATTERNS_SCHEMA>({
  product_id: {
    type: SchemaTypes.String,
    required: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  details: [
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
  min_purchasable: {
    type: SchemaTypes.Number,
    required: true,
  },
  max_purchasable: {
    type: SchemaTypes.Number,
    required: true,
  },
  price: {
    type: SchemaTypes.Number,
    required: true,
  },
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

export const patterns = db.model<PATTERNS_SCHEMA>(
  'patterns',
  patterns_schema,
);
