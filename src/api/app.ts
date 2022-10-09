import fastifyCors from '@fastify/cors';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fastify from 'fastify';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { v1 } from './v1';

initializeApp({
  credential: applicationDefault(),
});

const app = fastify({
  logger: true,
});
app.register(fastifyCors);

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: 'array',
  allErrors: true,
  strict: false,
});
addFormats(ajv);

app.setValidatorCompiler(({ schema }) => ajv.compile(schema) as any);

app.register(v1, {
  prefix: '/v1',
});

export { app };
