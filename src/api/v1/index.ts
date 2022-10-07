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

  instance.route({
    url: '/:product_id/patterns',
    method: 'GET',
    schema: index.dynamic.patterns.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.dynamic.patterns.GET_handler,
  });

  instance.route({
    url: '/:product_id/patterns/:pattern_id',
    method: 'GET',
    schema: index.dynamic.patterns.dynamic.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.dynamic.patterns.dynamic.GET_handler,
  });

  instance.route({
    url: '/bags',
    method: 'POST',
    schema: index.bags.POST_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.bags.POST_handler,
  });

  instance.route({
    url: '/bags',
    method: 'GET',
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.bags.GET_handler,
  });

  instance.route({
    url: '/bags/:bag_id',
    method: 'DELETE',
    schema: index.bags.dynamic.DELETE_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.bags.dynamic.DELETE_handler,
  });

  instance.route({
    url: '/bags/:bag_id',
    method: 'PATCH',
    schema: index.bags.dynamic.PATCH_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.bags.dynamic.PATCH_handler,
  });

  instance.route({
    url: '/orders',
    method: 'POST',
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.orders.POST_handler,
  });

  instance.route({
    url: '/orders',
    method: 'GET',
    schema: index.orders.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.orders.GET_handler,
  });
};
