import { EnvConfig } from './env-config.interface';
import { PORTS } from '../../src/client/core/shared/config/build-env';

// var hostname = '192.168.0.108';
var protocol = 'https';
var domain = 'wthapps.com';
var subdomain = `testing`;
var fullDomain = `${subdomain}.${domain}`;



const ProdConfig: EnvConfig = {
  API:`${protocol}://api-${fullDomain}`,
  ENV: 'PROD',
  DOMAIN: `${fullDomain}`,
  SUB_DOMAIN: {
    APP: `${protocol}://${fullDomain}`,
    MYACCOUNT: `${protocol}://my-${fullDomain}`,
    MEDIA: `${protocol}://media-${fullDomain}`,
    SOCIAL: `${protocol}://social-${fullDomain}`,
    CHAT: `${protocol}://chat-${fullDomain}`,
    CONTACT: `${protocol}://contact-${fullDomain}`
  },
  RES: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon'
};

// const ProdConfig: EnvConfig = {
//   API:`${protocol}://${hostname}:${PORTS['api']}`,
//   ENV: 'PROD',
//   DOMAIN: `${hostname}`,
//   SUB_DOMAIN: {
//     APP: `${protocol}://${hostname}:${PORTS['portal']}`,
//     MYACCOUNT: `${protocol}://${hostname}:${PORTS['my']}`,
//     MEDIA: `${protocol}://${hostname}:${PORTS['media']}`,
//     SOCIAL: `${protocol}://${hostname}:${PORTS['social']}`,
//     CHAT: `${protocol}://${hostname}:${PORTS['chat']}`
//   },
//   RES: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon'
// };

export = ProdConfig;

