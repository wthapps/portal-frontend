import { EnvConfig } from './env-config.interface';

export const environment = {
  production: true,
  keys: {
    recaptcha_site_key: '6LdCdU0UAAAAADLbZ8Vf6UoQ-TeyzZjhOEiwcXxJ',
    adyen_public_key: '10001|BD56A321C8083026355A289AD273D26415C410A4921A1D6F10C6CDED438140DB09A72E8D3D48256BA470D9A02331FBB0CF2C42BF5CFE7F53FA5F7B2939EFA69A9347A68339B7EADD87B7FD9CDFB23D1F222F100B7D64BF661E28F8B8FF08FF5F643A1BFF1609C0F67426C42C3FA44315C9E93EA5663C39B71F60B1388AFB3A5714962B77C876FC6F6A4DD8D4CC572D9111CDC53D09FE54EF2FDBA44608BF745A795C19DA09C1BAE4A53D25484E1878AFA0ED88B8C7E877D706B5A428CC40C11280CEFB4ACCCCC8D00ADD8DB70248BF2E35FF32D5753525C64673EEE4F949C117626F3692F2E0FEB9682B3A4DDD60D8503E9B276668E6B2CDF33D31734FE8C9B5'
  }
};

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
    NOTE: `${protocol}://notes${fullDomain}`
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
