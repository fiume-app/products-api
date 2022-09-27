import { preHandlerHookHandler } from 'fastify';
import { LeanDocument } from 'mongoose';
import { buyers } from '../../../db/buyers';
import { BUYERS_SCHEMA } from '../../../db/buyers/types';

export const fetch_buyer: preHandlerHookHandler = async (request, reply) => {
  // @ts-ignore
  const decoded_token = request.decoded_token as DecodedIdToken;

  let fetch_res: LeanDocument<BUYERS_SCHEMA & { _id: any }> | null;

  try {
    fetch_res = await buyers
      .findOne({
        email: decoded_token.email,
      })
      .lean();
  } catch (e) {
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  if (fetch_res) {
    // @ts-ignore
    request.user = fetch_res;

    return;
  }

  reply.status(400).send({
    type: 'USER_NOT_FOUND_ERROR',
    msg: 'User not found',
    error: 'user is not added to database',
  });
};
