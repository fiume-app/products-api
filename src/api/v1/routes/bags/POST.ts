import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { ADDRESSES_SCHEMA } from '../../../../db/addresses/types';
import { bags } from '../../../../db/bags';
import { BUYERS_SCHEMA } from '../../../../db/buyers/types';
import { inventory } from '../../../../db/inventory';

export interface PostBody {
  product_id: string,
  pattern_id: string,
  address_id: string,
  qty: number,
}

const body_schema: JSONSchemaType<PostBody> = {
  type: 'object',
  properties: {
    product_id: {
      type: 'string',
    },
    pattern_id: {
      type: 'string',
    },
    address_id: {
      type: 'string',
    },
    qty: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
    },
  },
  required: [
    'product_id',
    'pattern_id',
    'address_id',
    'qty',
  ],
  additionalProperties: false,
};

export const POST_validation_schema: FastifySchema = {
  body: body_schema,
};

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  const body = request.body as PostBody;

  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  let fetch_res: LeanDocument<{
    _id: any,
    inventory_count: number,
    address?: LeanDocument<ADDRESSES_SCHEMA & { _id: any }>,
  }>[];

  try {
    fetch_res = await inventory
      .aggregate()
      .match({
        product_id: body.product_id,
        pattern_id: body.pattern_id,
        status: 'available',
        purchasable: true,
      })
      .group({
        _id: '$pattern_id',
        inventory_count: {
          $sum: 1,
        },
      })
      .lookup({
        from: 'addresses',
        as: 'address',
        let: {
          buyer_id: {
            $toString: user._id,
          },
          address_id: {
            $toObjectId: body.address_id,
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$_id',
                      '$$address_id',
                    ],
                  },
                  {
                    $eq: [
                      '$buyer_id',
                      '$$buyer_id',
                    ],
                  },
                ],
              },
            },
          },
        ],
      })
      .addFields({
        address: {
          $first: '$address',
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

  if (fetch_res.length === 0) {
    reply.status(404).send({
      type: 'OUT_OF_STOCK_ERROR',
      msg: 'Product is out of stock',
      error: 'out of stock',
    });
    return;
  }

  if (!fetch_res[0].address) {
    reply.status(500).send({
      type: 'ADDRESS_ERROR',
      msg: 'address is incorrect',
      error: 'address not found',
    });
    return;
  }

  try {
    await bags
      .create({
        buyer_id: user._id,
        product_id: body.product_id,
        pattern_id: body.pattern_id,
        address_id: body.address_id,
        qty: body.qty,
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
