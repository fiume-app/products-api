import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument, Types } from 'mongoose';
import { BUYERS_SCHEMA } from '../../../../../../db/buyers/types';
import { PATTERNS_SCHEMA } from '../../../../../../db/patterns/types';
import { products } from '../../../../../../db/products';
import { PRODUCTS_SCHEMA } from '../../../../../../db/products/types';

export interface GetParams {
  product_id: string,
  pattern_id: string,
}

const params_schema: JSONSchemaType<GetParams> = {
  type: 'object',
  properties: {
    product_id: {
      type: 'string',
    },
    pattern_id: {
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

  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  let fetch_res: LeanDocument<{
    _id: any,
    product: LeanDocument<PRODUCTS_SCHEMA & { _id: any }>,
    pattern: LeanDocument<PATTERNS_SCHEMA & { _id: any }>,
    inventory_count: number,
  }>[];

  try {
    fetch_res = await products
      .aggregate()
      .match({
        _id: new Types.ObjectId(params.product_id),
        purchasable: true,
        quarantined: false,
        banned: false,
      })
      .project({
        product: '$$ROOT',
      })
      .lookup({
        from: 'patterns',
        as: 'pattern',
        let: {
          pattern_id: {
            $toObjectId: params.pattern_id,
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
            },
          },
        ],
      })
      .addFields({
        pattern: {
          $first: '$pattern',
        },
      })
      .lookup({
        from: 'inventories',
        as: 'inventory_count',
        let: {
          pattern_id: params.pattern_id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
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
      })
      .lookup({
        from: 'bags',
        as: 'bag_contains',
        let: {
          buyer_id: {
            $toString: user._id,
          },
          product_id: {
            $toString: '$product._id',
          },
          pattern_id: {
            $toString: '$pattern._id',
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$buyer_id',
                      '$$buyer_id',
                    ],
                  },
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
                ],
              },
            },
          },
        ],
      })
      .addFields({
        bag_contains: {
          $cond: {
            if: {
              $eq: [
                {
                  $size: '$bag_contains',
                },
                0,
              ],
            },
            then: false,
            else: true,
          },
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

  if (fetch_res[0]) {
    reply.status(200).send(fetch_res[0]);
    return;
  }

  reply.status(400).send({
    type: 'PRODUCT_NOT_FOUND_ERROR',
    msg: 'Product not found',
    error: 'product is not added to database',
  });
};
