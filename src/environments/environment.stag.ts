// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { EnvConfig } from './env-config.interface';

export const environment = {
  production: false,
  keys: {
    recaptcha_site_key: '6Ld0dU0UAAAAAK5cM_IEAe5LhpzKT-a250aDMZPl'
  }
};

console.log('environment:::', environment);

const host = '192.168.0.116';
// const host = 'localhost';

const apiPort = 80000;
export const ConfigByEnv: EnvConfig = {
  CDN: `http://${host}:${apiPort}/assets`,
  API: `http://${host}:${apiPort}`,
  ENV: 'DEV',
  DOMAIN: 'localhost',
  SUB_DOMAIN: {
    APP: 'http://localhost:30000',
    MYACCOUNT: 'http://localhost:30005',
    MEDIA: 'http://localhost:30010',
    SOCIAL: 'http://localhost:30015',
    CHAT: 'http://localhost:30020',
    CONTACT: 'http://localhost:30025',
    NOTE: 'http://localhost:30030'
  }
};
