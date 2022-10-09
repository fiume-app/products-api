import { RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { bags } from '../../../../db/bags';
import { BAGS_SCHEMA } from '../../../../db/bags/types';
import { BUYERS_SCHEMA } from '../../../../db/buyers/types';
import { db } from '../../../../db/config';
import { inventory } from '../../../../db/inventory';
import { INVENTORY_SCHEMA } from '../../../../db/inventory/types';
import { orders } from '../../../../db/orders';
import { ORDERS_SCHEMA } from '../../../../db/orders/types';

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  const session = await db.startSession();

  session.startTransaction();

  let bags_res: LeanDocument<BAGS_SCHEMA & {
    _id: any,
    inventory: LeanDocument<INVENTORY_SCHEMA & { _id: any }>[],
    inventory_count: number,
  }>[];

  try {
    bags_res = await bags
      .aggregate()
      .match({
        buyer_id: user._id.toString(),
      })
      .lookup({
        from: 'inventories',
        as: 'inventory',
        let: {
          pattern_id: '$pattern_id',
          qty: '$qty',
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
            $limit: 10,
          },
        ],
      })
      .addFields({
        inventory: {
          $slice: [
            '$inventory',
            '$qty',
          ],
        },
      })
      .addFields({
        inventory_count: {
          $size: '$inventory',
        },
      })
      .redact({
        $gte: [
          '$inventory_count',
          '$qty',
        ],
      }, '$$KEEP', '$$PRUNE')
      .session(session);
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    await session.endSession();
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  if (bags_res.length === 0) {
    await session.abortTransaction();
    await session.endSession();
    reply.status(404).send({
      type: 'BAG_EMPTY_ERROR',
      msg: 'Add Something to Bag',
      error: 'bag empty',
    });
    return;
  }

  let order_res: LeanDocument<ORDERS_SCHEMA & { _id: any }>[];

  try {
    order_res = await orders
      .create([{
        buyer_id: user._id,
        notes: [],
        status: 'placed',
        payment_gateway: 'mock',
        payment_status: 'paid',
        gateway_details: {
          payment_id: 'mock',
          order_id: 'mock',
        },
      }], {
        session,
      });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    await session.endSession();
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  const ids: string[] = [];

  bags_res.forEach((l) => {
    l.inventory.forEach((m) => {
      ids.push(m._id);
    });
  });

  try {
    await inventory
      .updateMany({
        _id: {
          $in: ids,
        },
      }, {
        $set: {
          status: 'ordered',
          order_id: order_res[0]._id,
        },
      }, {
        multi: true,
        session,
      });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    await session.endSession();
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  try {
    await bags.deleteMany({
      buyer_id: user._id,
    }, {
      session,
    });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    await session.endSession();
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  await session.commitTransaction();
  await session.endSession();

  reply.status(200).send();
};
