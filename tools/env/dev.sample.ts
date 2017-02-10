import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  // API: '54.213.41.54:4000',
  // API: '192.168.0.105:4000',
  API: 'localhost:4000',
  ENV: 'DEV',
  DOMAIN: 'localhost',
  PROTOCOL: 'http',
  SUB_DOMAIN: {
    FE_APP: 'http://localhost:3000',
    FE_MYACCOUNT: 'http://localhost:3100'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = DevConfig;

