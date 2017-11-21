import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  API: 'https://54.213.41.54:4000',
  ENV: 'DEV',
  DOMAIN: 'localhost',
  SUB_DOMAIN: {
    APP: 'https://localhost:3000',
    MYACCOUNT: 'https://localhost:3005',
    MEDIA: 'https://localhost:3010',
    SOCIAL: 'https://localhost:3015',
    CHAT: 'https://localhost:3020',
    CONTACT: 'https://localhost:3025',
    NOTE: 'https://localhost:3030',
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = DevConfig;

