import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  // API: 'http://54.213.41.54:4000',
  // API: 'http://192.168.0.104:4000',
  // API: 'http://192.168.0.106:4000',
  API: 'http://localhost:4000',
  // API: 'http://192.168.0.111:4000',
  // API: 'http://192.168.0.103:4000',
  ENV: 'DEV',
  DOMAIN: 'localhost',
  SUB_DOMAIN: {
    APP: 'http://localhost:3000',
    MYACCOUNT: 'http://localhost:3005',
    MEDIA: 'http://localhost:3010',
    SOCIAL: 'http://localhost:3015',
    CHAT: 'http://localhost:3020',
    CONTACT: 'http://localhost:3025',
    NOTE: 'http://localhost:3030',
  }
};

export = DevConfig;
