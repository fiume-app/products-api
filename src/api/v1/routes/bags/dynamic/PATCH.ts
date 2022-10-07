import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { bags } from '../../../../../db/bags';

export interface PatchParams {
  bag_id: string,
}

export interface PatchQuery {
  qty: 'increment' | 'decrement',
}

const params_schema: JSONSchemaType<PatchParams> = {
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

const query_schema: JSONSchemaType<PatchQuery> = {
  type: 'object',
  properties: {
    qty: {
      type: 'string',
      enum: [
        'increment',
        'decrement',
      ],
    },
  },
  required: [
    'qty',
  ],
  additionalProperties: false,
};

export const PATCH_validation_schema: FastifySchema = {
  params: params_schema,
  querystring: query_schema,
};

export const PATCH_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as PatchParams;

  const query = request.query as PatchQuery;

  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  try {
    await bags
      .updateOne({
        _id: params.bag_id,
        buyer_id: user._id,
      }, {
        $inc: {
          qty: query.qty === 'increment' ? 1 : -1,
        },
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
