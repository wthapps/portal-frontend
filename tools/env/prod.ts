import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  API: 'https://54.213.41.54:40000',
  ENV: 'PROD',
  DOMAIN: '54.213.41.54',
  SUB_DOMAIN: {
    APP: 'https://54.213.41.54:3000',
    MYACCOUNT: 'https://54.213.41.54:3005',
    MEDIA: 'https://54.213.41.54:3010',
    SOCIAL: 'https://54.213.41.54:3015',
    CHAT: 'https://54.213.41.54:3020'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = ProdConfig;

