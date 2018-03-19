import { EnvConfig } from './env-config.interface';

export const environment = {
  production: true,
  keys: {
    recaptcha_site_key: '6LdCdU0UAAAAADLbZ8Vf6UoQ-TeyzZjhOEiwcXxJ'
  }
};

console.log('environment:::', environment);

// var hostname = '192.168.0.108';
const protocol = 'https';
const domain = 'wthapps.com';
const subdomain = ``;
const fullDomain = `${subdomain}.${domain}`;

export const ConfigByEnv: EnvConfig = {
  CDN: `${protocol}://cdn-apps.${domain}`,
  API: `${protocol}://api${fullDomain}`,
  ENV: 'PROD',
  DOMAIN: `${domain}`,
  SUB_DOMAIN: {
    APP: `${protocol}://www${fullDomain}`,
    MYACCOUNT: `${protocol}://myaccount${fullDomain}`,
    MEDIA: `${protocol}://media${fullDomain}`,
    SOCIAL: `${protocol}://social${fullDomain}`,
    CHAT: `${protocol}://chat${fullDomain}`,
    CONTACT: `${protocol}://contacts${fullDomain}`,
    NOTE: `${protocol}://notes${fullDomain}`,
  }
};


// // const host = '192.168.0.116';
// const host = 'localhost';
//
// export const ConfigByEnv: EnvConfig = {
//   CDN: `http://${host}:4000/assets`,
//   API: `http://${host}:4000`,
//   ENV: 'DEV',
//   DOMAIN: 'localhost',
//   SUB_DOMAIN: {
//     APP: 'http://localhost:3000',
//     MYACCOUNT: 'http://localhost:3005',
//     MEDIA: 'http://localhost:3010',
//     SOCIAL: 'http://localhost:3015',
//     CHAT: 'http://localhost:3020',
//     CONTACT: 'http://localhost:3025',
//     NOTE: 'http://localhost:3030',
//   }
// };
