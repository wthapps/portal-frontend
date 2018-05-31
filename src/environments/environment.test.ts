import { EnvConfig } from './env-config.interface';

export const environment = {
  production: false,
  keys: {
    recaptcha_site_key: '6LeLfVwUAAAAAHc9gEWymlN8dj5jmxPcVpa8nGBK'
  }
};

console.log('environment:::', environment);

// var hostname = '192.168.0.108';
const protocol = 'https';
const domain = 'wthapps.com';
const subdomain = `test`;
const fullDomain = `${subdomain}.${domain}`;

export const ConfigByEnv: EnvConfig = {
  CDN: `${protocol}://cdn-apps.${domain}`,
  API: `${protocol}://api-${fullDomain}`,
  ENV: 'TEST',
  DOMAIN: `${domain}`,
  SUB_DOMAIN: {
    APP: `${protocol}://${fullDomain}`,
    MYACCOUNT: `${protocol}://myaccount-${fullDomain}`,
    MEDIA: `${protocol}://media-${fullDomain}`,
    SOCIAL: `${protocol}://social-${fullDomain}`,
    CHAT: `${protocol}://chat-${fullDomain}`,
    CONTACT: `${protocol}://contacts-${fullDomain}`,
    NOTE: `${protocol}://notes-${fullDomain}`
  }
};
