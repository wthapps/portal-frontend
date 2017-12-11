import { EnvConfig } from './env-config.interface';
export const environment = {
  production: true
};


// import { PORTS } from '../../src/client/core/shared/config/build-env';

// var hostname = '192.168.0.108';
// var protocol = 'https';
// var domain = 'wthapps.com';
// var subdomain = ``;
// var fullDomain = `${subdomain}.${domain}`;
//
// export const ConfigByEnv: EnvConfig = {
//   API:`${protocol}://api${fullDomain}`,
//   ENV: 'PROD',
//   DOMAIN: `${domain}`,
//   SUB_DOMAIN: {
//     APP: `${protocol}://www${fullDomain}`,
//     MYACCOUNT: `${protocol}://myaccount${fullDomain}`,
//     MEDIA: `${protocol}://media${fullDomain}`,
//     SOCIAL: `${protocol}://social${fullDomain}`,
//     CHAT: `${protocol}://chat${fullDomain}`,
//     CONTACT: `${protocol}://contacts${fullDomain}`,
//     NOTE: `${protocol}://notes${fullDomain}`,
//   }
// };

console.log('environment:::', environment);

export const ConfigByEnv: EnvConfig = {
  // API: 'http://54.213.41.54:4000',
  API: 'http://localhost:4000',
  // API: 'http://192.168.0.106:4000',
  // API: 'http://192.168.0.111:4000',
  // API: 'http://192.168.0.103:4000',
  ENV: 'PROD',
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
