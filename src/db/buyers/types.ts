import { Document } from 'mongoose';

export interface BUYERS_SCHEMA extends Document {
  name: string,
  email: string,
  contact?: string,
  quarantined: boolean,
  banned: boolean,
}
