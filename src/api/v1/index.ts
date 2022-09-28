import { FastifyPluginAsync } from 'fastify';
import { fetch_buyer } from './plugins/fetch_buyer';
import { verify_firebase_id_token } from './plugins/verify_firebase_id_token';

import * as index from './routes';

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.decorateRequest('decoded_token', null);
  instance.decorateRequest('user', null);

  instance.route({
    url: '/',
    method: 'GET',
    schema: index.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.GET_handler,
  });
};
