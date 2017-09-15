import { EnvConfig } from './env-config.interface';
// import { PORTS } from '../../src/client/core/shared/config/build-env';

// var hostname = '192.168.0.108';
var protocol = 'https';
var domain = 'wthapps.com';
var subdomain = `testing`;
var fullDomain = `${subdomain}.${domain}`;



const ProdConfig: EnvConfig = {
  API:`${protocol}://api-${fullDomain}`,
  ENV: 'PROD',
  DOMAIN: `${domain}`,
  SUB_DOMAIN: {
    APP: `${protocol}://${fullDomain}`,
    MYACCOUNT: `${protocol}://my-${fullDomain}`,
    MEDIA: `${protocol}://media-${fullDomain}`,
    SOCIAL: `${protocol}://social-${fullDomain}`,
    CHAT: `${protocol}://chat-${fullDomain}`,
    CONTACT: `${protocol}://contact-${fullDomain}`,
    NOTE: `${protocol}://note-${fullDomain}`,
  }
};

export = ProdConfig;
