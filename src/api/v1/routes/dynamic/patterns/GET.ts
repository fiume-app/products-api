import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { patterns } from '../../../../../db/patterns';
import { PATTERNS_SCHEMA } from '../../../../../db/patterns/types';

export interface GetParams {
  product_id: string,
}

const params_schema: JSONSchemaType<GetParams> = {
  type: 'object',
  properties: {
    product_id: {
      type: 'string',
    },
  },
  required: [
    'product_id',
  ],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  params: params_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as GetParams;

  let fetch_res: LeanDocument<PATTERNS_SCHEMA & {
    _id: any,
    inventory_count: number,
  }>[];

  try {
    fetch_res = await patterns
      .aggregate()
      .match({
        product_id: params.product_id,
        purchasable: true,
        quarantined: false,
        banned: false,
      })
      .unwind('$images')
      .lookup({
        from: 'product_photos',
        let: {
          image_id: {
            $toObjectId: '$images.image',
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  '$_id',
                  '$$image_id',
                ],
              },
            },
          },
        ],
        as: 'images',
      })
      .addFields({
        images: {
          $first: '$images',
        },
      })
      .group({
        _id: '$_id',
        product_id: {
          $first: '$product_id',
        },
        name: {
          $first: '$name',
        },
        details: {
          $first: '$details',
        },
        min_purchasable: {
          $first: '$min_purchasable',
        },
        max_purchasable: {
          $first: '$max_purchasable',
        },
        price: {
          $first: '$price',
        },
        purchasable: {
          $first: '$purchasable',
        },
        quarantined: {
          $first: '$quarantined',
        },
        banned: {
          $first: '$banned',
        },
        createdAt: {
          $first: '$createdAt',
        },
        updatedAt: {
          $first: '$updatedAt',
        },
        images: {
          $push: '$images',
        },
      })
      .lookup({
        from: 'inventories',
        as: 'inventory_count',
        let: {
          product_id: '$product_id',
          pattern_id: {
            $toString: '$_id',
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$product_id',
                      '$$product_id',
                    ],
                  },
                  {
                    $eq: [
                      '$pattern_id',
                      '$$pattern_id',
                    ],
                  },
                  {
                    $eq: [
                      '$status',
                      'available',
                    ],
                  },
                  '$purchasable',
                ],
              },
            },
          },
          {
            $group: {
              _id: '$pattern_id',
              inventory_count: {
                $sum: 1,
              },
            },
          },
        ],
      })
      .addFields({
        inventory_count: {
          $first: '$inventory_count',
        },
      })
      .addFields({
        inventory_count: '$inventory_count.inventory_count',
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

  reply.status(200).send(fetch_res);
};
