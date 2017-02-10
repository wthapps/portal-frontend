import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  API: '54.213.41.54:4000',
  ENV: 'PROD',
  DOMAIN: 'wthapps.com',
  PROTOCOL: 'https',
  SUB_DOMAIN: {
    FE_APP: 'http://localhost:3000',
    FE_MYACCOUNT: 'http://localhost:3100'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = ProdConfig;

