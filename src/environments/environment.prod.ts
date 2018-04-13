// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { EnvConfig } from './env-config.interface';

export const environment = {
  production: true,
  keys: {
    recaptcha_site_key: '6Ld0dU0UAAAAAK5cM_IEAe5LhpzKT-a250aDMZPl'
  }
};

console.log('environment:::', environment);

// const host = '192.168.0.109';
// const host = '192.168.0.106';
const host = '192.168.0.109';
const apiPort = 4000;

export const ConfigByEnv: EnvConfig = {
  CDN: `http://${host}:4000/assets`,
  API: `http://${host}:4000`,
  ENV: 'PROD',
  DOMAIN: '192.168.0.109',
  SUB_DOMAIN: {
    APP: 'http://192.168.0.109:3000',
    MYACCOUNT: 'http://192.168.0.109:3005',
    MEDIA: 'http://192.168.0.109:3010',
    SOCIAL: 'http://192.168.0.109:3015',
    CHAT: 'http://192.168.0.109:3020',
    CONTACT: 'http://192.168.0.109:3025',
    NOTE: 'http://192.168.0.109:3030'
  }
};
