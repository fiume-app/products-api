import { RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { bags } from '../../../../db/bags';
import { BUYERS_SCHEMA } from '../../../../db/buyers/types';
import { PATTERNS_SCHEMA } from '../../../../db/patterns/types';
import { PRODUCTS_SCHEMA } from '../../../../db/products/types';

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  let fetch_res: LeanDocument<{
    _id: any,
    inventory_count: number,
    roduct: LeanDocument<PRODUCTS_SCHEMA & { _id: any }>,
    pattern: LeanDocument<PATTERNS_SCHEMA & { _id: any }>,
  }>[];

  try {
    fetch_res = await bags
      .aggregate()
      .match({
        buyer_id: user._id.toString(),
      })
      .lookup({
        from: 'inventories',
        as: 'inventory_count',
        let: {
          pattern_id: '$pattern_id',
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
        from: 'products',
        as: 'product',
        let: {
          product_id: {
            $toObjectId: '$product_id',
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
        ],
      })
      .lookup({
        from: 'patterns',
        as: 'pattern',
        let: {
          pattern_id: {
            $toObjectId: '$pattern_id',
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

  reply.status(200).send(fetch_res);
};
