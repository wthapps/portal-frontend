import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  // Sample API url
  API: 'localhost:4000',
  DOMAIN: 'wthapps.com',
  PROTOCOL: 'http',
  SUB_DOMAIN: {
    FE_APP: 'http://localhost:3000',
    FE_MYACCOUNT: 'http://localhost:3100'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = BaseConfig;

