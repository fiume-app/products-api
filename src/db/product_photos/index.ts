import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { PRODUCT_PHOTOS_SCHEMA } from './types';

const product_photos_schema = new Schema<PRODUCT_PHOTOS_SCHEMA>({
  filename: {
    type: SchemaTypes.String,
    required: true,
  },
  mimeType: {
    type: SchemaTypes.String,
    required: true,
  },
  filesize: {
    type: SchemaTypes.Number,
    required: true,
  },
  width: {
    type: SchemaTypes.Number,
    required: true,
  },
  height: {
    type: SchemaTypes.Number,
    required: true,
  },
  sizes: {
    small: {
      filename: {
        type: SchemaTypes.String,
        required: true,
      },
      mimeType: {
        type: SchemaTypes.String,
        required: true,
      },
      filesize: {
        type: SchemaTypes.Number,
        required: true,
      },
      width: {
        type: SchemaTypes.Number,
        required: true,
      },
      height: {
        type: SchemaTypes.Number,
        required: true,
      },
    },
    medium: {
      filename: {
        type: SchemaTypes.String,
        required: true,
      },
      mimeType: {
        type: SchemaTypes.String,
        required: true,
      },
      filesize: {
        type: SchemaTypes.Number,
        required: true,
      },
      width: {
        type: SchemaTypes.Number,
        required: true,
      },
      height: {
        type: SchemaTypes.Number,
        required: true,
      },
    },
    large: {
      filename: {
        type: SchemaTypes.String,
        required: true,
      },
      mimeType: {
        type: SchemaTypes.String,
        required: true,
      },
      filesize: {
        type: SchemaTypes.Number,
        required: true,
      },
      width: {
        type: SchemaTypes.Number,
        required: true,
      },
      height: {
        type: SchemaTypes.Number,
        required: true,
      },
    },
    xlarge: {
      filename: {
        type: SchemaTypes.String,
        required: true,
      },
      mimeType: {
        type: SchemaTypes.String,
        required: true,
      },
      filesize: {
        type: SchemaTypes.Number,
        required: true,
      },
      width: {
        type: SchemaTypes.Number,
        required: true,
      },
      height: {
        type: SchemaTypes.Number,
        required: true,
      },
    },
  },
}, {
  timestamps: true,
});

export const product_photos = db.model<PRODUCT_PHOTOS_SCHEMA>(
  'product_photos',
  product_photos_schema,
);
