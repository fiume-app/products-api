import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { ADDRESSES_SCHEMA } from './types';

const addresses_schema = new Schema<ADDRESSES_SCHEMA>({
  buyer_id: {
    type: SchemaTypes.String,
    required: true,
  },
  line1: {
    type: SchemaTypes.String,
    maxlength: 128,
    required: true,
  },
  line2: {
    type: SchemaTypes.String,
    maxlength: 128,
  },
  city: {
    type: SchemaTypes.String,
    maxlength: 128,
  },
  state: {
    type: SchemaTypes.String,
    maxlength: 128,
  },
  pin_code: {
    type: SchemaTypes.String,
    maxlength: 6,
  },
}, {
  timestamps: true,
});

export const addresses = db.model<ADDRESSES_SCHEMA>(
  'addresses',
  addresses_schema,
);
