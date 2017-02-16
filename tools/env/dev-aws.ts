import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  API: 'https://54.213.41.54:4000',
  ENV: 'DEV',
  DOMAIN: 'localhost',
  SUB_DOMAIN: {
    APP: 'https://localhost:3000',
    MYACCOUNT: 'https://localhost:3100',
    MEDIA: 'https://localhost:3200',
    SOCIAL: 'https://localhost:3300',
    CHAT: 'https://localhost:3400'
  },
  RES: 'https://s3-ap-southeast-1.amazonaws.com/env-staging'
};

export = DevConfig;

