import { createConnection } from 'mongoose';

export const db = createConnection(
  process.env.DB_URI ?? '',
  {
    dbName: 'fiume',
    autoCreate: true,
  },
);
