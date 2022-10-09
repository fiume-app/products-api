/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

const serverless_configuration: AWS = {
  service: 'fiume-products-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-south-1',
    endpointType: 'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    api: {
      handler: 'lambda_compatability/main.handler',
      events: [
        {
          http: 'ANY /',
        },
        {
          http: 'ANY /{proxy+}',
        },
      ],
      timeout: 20,
      memorySize: 512,
      environment: {
        DEPLOYMENT_ENV: '${env:DEPLOYMENT_ENV}',
        DB_URI: '${env:DB_URI}',
        GOOGLE_APPLICATION_CREDENTIALS: 'firebase-credentials.json',
      },
    },
  },
  useDotenv: true,
  package: {
    individually: true,
    include: [
      'firebase-credentials.json',
    ],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverless_configuration;
