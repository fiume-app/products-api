import { FastifyPluginAsync } from 'fastify';

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.decorateRequest('decoded_token', null);
  instance.decorateRequest('user', null);
};
