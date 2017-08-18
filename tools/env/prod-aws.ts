import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  API: 'https://54.213.41.54:4000',
  ENV: 'PROD',
  DOMAIN: 'wthapps.com',
  SUB_DOMAIN: {
    APP: 'https://wthapps.com',
    MYACCOUNT: 'https://my.wthapps.com',
    MEDIA: 'https://media.wthapps.com',
    SOCIAL: 'https://social.wthapps.com',
    CHAT: 'https://chat.wthapps.com',
    CONTACT: 'https://contact.wthapps.com',
  }
};

export = ProdConfig;

