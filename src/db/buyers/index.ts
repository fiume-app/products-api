import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { BUYERS_SCHEMA } from './types';

const buyers_schema = new Schema<BUYERS_SCHEMA>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  email: {
    type: SchemaTypes.String,
    required: true,
  },
  contact: {
    type: SchemaTypes.String,
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

export const buyers = db.model<BUYERS_SCHEMA>(
  'buyers',
  buyers_schema,
);
