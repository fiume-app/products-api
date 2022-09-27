import { preHandlerHookHandler } from 'fastify';
import { getAuth } from 'firebase-admin/auth';

export const verify_firebase_id_token: preHandlerHookHandler = async (request, reply) => {
  const token_from_header = request.headers.authorization;

  if (!token_from_header) {
    reply
      .status(404)
      .send({
        code: 'AUTHORIZATION_HEADER_MISSING',
        msg: 'Unable to Authorize request',
        error: 'make sure you have added authorization header. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization',
      });
    return;
  }

  try {
    const decoded_token = await getAuth()
      .verifyIdToken(token_from_header);

    // @ts-ignore
    request.decoded_token = decoded_token;

    return;
  } catch (e) {
    reply
      .status(404)
      .send({
        code: 'INCORRECT_ID_TOKEN',
        msg: 'Unable to Authorize request',
        error: e,
      });
  }
};
