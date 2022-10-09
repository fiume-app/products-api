/* eslint-disable import/no-import-module-exports */
import awsLambdaFastify from '@fastify/aws-lambda';
import { app } from '../src/api/app';

exports.handler = awsLambdaFastify(app, {
  callbackWaitsForEmptyEventLoop: false,
});
