// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { EnvConfig } from './env-config.interface';

export const environment = {
  production: false,
  keys: {
    recaptcha_site_key: '6Ld0dU0UAAAAAK5cM_IEAe5LhpzKT-a250aDMZPl',
    vapid_public_key:
      'BGCtgD5y7MBVzqAB4mkRLR-SIqwEFPHaeEwPBa-Px1ne_Ykj6LZ7hBBKx6u6PEQNeM9vb1UXojDXrxF9WNdzMF0=',
    adyen_public_key:
      '10001|BD56A321C8083026355A289AD273D26415C410A4921A1D6F10C6CDED438140DB09A72E8D3D48256BA470D9A02331FBB0CF2C42BF5CFE7F53FA5F7B2939EFA69A9347A68339B7EADD87B7FD9CDFB23D1F222F100B7D64BF661E28F8B8FF08FF5F643A1BFF1609C0F67426C42C3FA44315C9E93EA5663C39B71F60B1388AFB3A5714962B77C876FC6F6A4DD8D4CC572D9111CDC53D09FE54EF2FDBA44608BF745A795C19DA09C1BAE4A53D25484E1878AFA0ED88B8C7E877D706B5A428CC40C11280CEFB4ACCCCC8D00ADD8DB70248BF2E35FF32D5753525C64673EEE4F949C117626F3692F2E0FEB9682B3A4DDD60D8503E9B276668E6B2CDF33D31734FE8C9B5',
    adyen_origin_key: 'pub.v2.8215375274000174.aHR0cDovL2xvY2FsaG9zdDozMDI1.eGiazM4qXe3_IRdEdzjOz6UVRGP9RchK1R3sj24czd8'
  }
};

console.log('environment:::', environment);

// const host = '192.168.0.109';
// const host = '192.168.0.106';
// const host = '192.168.0.112';
const host = 'localhost';

export const ConfigByEnv: EnvConfig = {
  CDN: `http://${host}:4000/assets`,
  API: `http://${host}:4000`,
  SOCKET_API: `ws://127.0.0.1:5000/socket`,
  GOOGLE_ANALYTICS_ID: 'UA-139547065-1',
  ENV: 'DEV',
  CLOUDFRONT: 'https://d3ukayp3hgsz16.cloudfront.net',
  DOMAIN: 'localhost',
  S3BUCKET: 'development-oregon',
  SUB_DOMAIN: {
    APP: 'http://localhost:3000',
    MYACCOUNT: 'http://localhost:3005',
    MEDIA: 'http://localhost:3010',
    SOCIAL: 'http://localhost:3015',
    CHAT: 'http://localhost:3020',
    CONTACT: 'http://localhost:3025',
    NOTE: 'http://localhost:3030'
  }
};
