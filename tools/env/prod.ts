import { EnvConfig } from './env-config.interface';
import { PORTS } from '../../src/client/core/shared/config/build-env';

// var hostname = '192.168.0.108';
var hostname = '54.213.41.54';

var protocol = 'https';

const ProdConfig: EnvConfig = {
  API:`${protocol}://${hostname}:${PORTS['api']}`,
  ENV: 'PROD',
  DOMAIN: `${hostname}`,
  SUB_DOMAIN: {
    APP: `${protocol}://${hostname}:${PORTS['portal']}`,
    MYACCOUNT: `${protocol}://${hostname}:${PORTS['my']}`,
    MEDIA: `${protocol}://${hostname}:${PORTS['media']}`,
    SOCIAL: `${protocol}://${hostname}:${PORTS['social']}`,
    CHAT: `${protocol}://${hostname}:${PORTS['chat']}`
  },
  RES: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon'
};

export = ProdConfig;

