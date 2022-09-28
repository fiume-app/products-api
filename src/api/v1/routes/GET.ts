import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { inventory } from '../../../db/inventory';
import { PRODUCTS_SCHEMA } from '../../../db/products/types';
import { PATTERNS_SCHEMA } from '../../../db/patterns/types';

export interface GetQuery {
  skip: number,
  limit: number,
}

const query_schema: JSONSchemaType<GetQuery> = {
  type: 'object',
  properties: {
    skip: {
      type: 'number',
      minimum: 0,
      maximum: 1000,
      default: 0,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  },
  required: [],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  querystring: query_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const query = request.query as GetQuery;

  let fetch_res: LeanDocument<{
    _id: any,
    product: LeanDocument<PRODUCTS_SCHEMA & { _id: any }>,
    pattern: LeanDocument<PATTERNS_SCHEMA & { _id: any }>,
  }>[];

  try {
    fetch_res = await inventory
      .aggregate()
      .match({
        status: 'available',
        purchasable: true,
      })
      .group({
        _id: '$pattern_id',
        product: {
          $first: '$product_id',
        },
        pattern: {
          $first: '$pattern_id',
        },
        inventory_count: {
          $sum: 1,
        },
      })
      .skip(query.skip)
      .limit(query.limit + 1)
      .lookup({
        from: 'products',
        as: 'product',
        let: {
          product_id: {
            $toObjectId: '$product',
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
                      '$$product_id',
                    ],
                  },
                  {
                    $eq: [
                      '$purchasable',
                      true,
                    ],
                  },
                  {
                    $eq: [
                      '$quarantined',
                      false,
                    ],
                  },
                  {
                    $eq: [
                      '$banned',
                      false,
                    ],
                  },
                ],
              },
            },
          },
          {
            $unwind: '$images',
          },
          {
            $lookup: {
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
            },
          },
          {
            $addFields: {
              images: {
                $first: '$images',
              },
            },
          },
          {
            $group: {
              _id: '$_id',
              name: {
                $first: '$name',
              },
              description: {
                $first: '$description',
              },
              min_purchasable: {
                $first: '$min_purchasable',
              },
              max_purchasable: {
                $first: '$max_purchasable',
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
            },
          },
        ],
      })
      .lookup({
        from: 'patterns',
        as: 'pattern',
        let: {
          pattern_id: {
            $toObjectId: '$pattern',
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
                      '$$pattern_id',
                    ],
                  },
                  {
                    $eq: [
                      '$purchasable',
                      true,
                    ],
                  },
                  {
                    $eq: [
                      '$quarantined',
                      false,
                    ],
                  },
                  {
                    $eq: [
                      '$banned',
                      false,
                    ],
                  },
                ],
              },
            },
          },
        ],
      })
      .addFields({
        product: {
          $first: '$product',
        },
        pattern: {
          $first: '$pattern',
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

  const has_more = fetch_res.length > query.limit;

  reply.status(200).send({
    has_more,
    data: has_more ? fetch_res.slice(0, -1) : fetch_res,
  });
};
