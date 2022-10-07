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
  differentiators: [
    {
      key: {
        type: SchemaTypes.String,
        required: true,
      },
      header_leading_enabled: {
        type: SchemaTypes.Boolean,
        required: true,
      },
      header_leading_type: {
        type: SchemaTypes.String,
        enum: [
          'icon',
        ],
      },
      header_leading_content: {
        type: SchemaTypes.String,
      },
      header_title: {
        type: SchemaTypes.String,
      },
      header_trailing_enabled: {
        type: SchemaTypes.Boolean,
        required: true,
      },
      header_trailing_type: {
        type: SchemaTypes.String,
        enum: [
          'link',
        ],
      },
      header_trailing_content: {
        type: SchemaTypes.String,
      },
      selector_type: {
        type: SchemaTypes.String,
        enum: [
          'image',
          'text',
        ],
        required: true,
      },
      selector_shape: {
        type: SchemaTypes.String,
        enum: [
          'circle',
          'rectangle',
          'square',
          'rounded_rectangle',
        ],
        required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

export const products = db.model<PRODUCTS_SCHEMA>(
  'products',
  products_schema,
);
