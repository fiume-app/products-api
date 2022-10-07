import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { bags } from '../../../../../db/bags';
import { BUYERS_SCHEMA } from '../../../../../db/buyers/types';

export interface DeleteParams {
  bag_id: string,
}

const params_schema: JSONSchemaType<DeleteParams> = {
  type: 'object',
  properties: {
    bag_id: {
      type: 'string',
    },
  },
  required: [
    'bag_id',
  ],
  additionalProperties: false,
};

export const DELETE_validation_schema: FastifySchema = {
  params: params_schema,
};

export const DELETE_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as DeleteParams;

  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  try {
    await bags
      .deleteOne({
        _id: params.bag_id,
        buyer_id: user._id,
      });
  } catch (e) {
    console.log(e);
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  reply.status(200).send();
};
