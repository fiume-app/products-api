import { Document } from 'mongoose';

export interface PRODUCT_PHOTOS_SCHEMA extends Document {
  filename: string,
  mimeType: string,
  filesize: number,
  width: number,
  height: number,
  sizes: {
    small?: {
      filename: string,
      mimeType: string,
      filesize: number,
      width: number,
      height: number,
    },
    medium?: {
      filename: string,
      mimeType: string,
      filesize: number,
      width: number,
      height: number,
    },
    large?: {
      filename: string,
      mimeType: string,
      filesize: number,
      width: number,
      height: number,
    },
    xlarge?: {
      filename: string,
      mimeType: string,
      filesize: number,
      width: number,
      height: number,
    }
  },
}
