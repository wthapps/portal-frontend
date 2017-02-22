import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  API: 'http://54.213.41.54:4000',
  ENV: 'PROD',
  DOMAIN: '54.213.41.54',
  SUB_DOMAIN: {
    APP: 'http://54.213.41.54:3000',
    MYACCOUNT: 'http://54.213.41.54:3005',
    MEDIA: 'http://54.213.41.54:3010',
    SOCIAL: 'http://54.213.41.54:3015',
    CHAT: 'http://54.213.41.54:3020'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = ProdConfig;

