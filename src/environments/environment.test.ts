import { EnvConfig } from './env-config.interface';

export const environment = {
  production: true,
  keys: {
    recaptcha_site_key: '6LeLfVwUAAAAAHc9gEWymlN8dj5jmxPcVpa8nGBK',
    vapid_public_key:
      'BL7xcOePidsUwdzZg9d9Y6lBKwhxBIl7TiJGuxgjmWlQUgSHlM7mjZ5t9PiasBVmD75EhlfOKIblyK_u68hx56g=',
    adyen_public_key:
      // tslint:disable-next-line:max-line-length
      '10001|BD56A321C8083026355A289AD273D26415C410A4921A1D6F10C6CDED438140DB09A72E8D3D48256BA470D9A02331FBB0CF2C42BF5CFE7F53FA5F7B2939EFA69A9347A68339B7EADD87B7FD9CDFB23D1F222F100B7D64BF661E28F8B8FF08FF5F643A1BFF1609C0F67426C42C3FA44315C9E93EA5663C39B71F60B1388AFB3A5714962B77C876FC6F6A4DD8D4CC572D9111CDC53D09FE54EF2FDBA44608BF745A795C19DA09C1BAE4A53D25484E1878AFA0ED88B8C7E877D706B5A428CC40C11280CEFB4ACCCCC8D00ADD8DB70248BF2E35FF32D5753525C64673EEE4F949C117626F3692F2E0FEB9682B3A4DDD60D8503E9B276668E6B2CDF33D31734FE8C9B5',
    adyen_origin_key: 'pub.v2.8215375274000174.aHR0cHM6Ly9teWFjY291bnQtdGVzdC53dGhhcHBzLmNvbQ.odIG-yVX4Qk2sbCyRvEXvWmFM4H5tpWZxXZH8osFMEI'
  }
};

const protocol = 'https';
const domain = 'wthapps.com';
const subdomain = `test`;
const fullDomain = `${subdomain}.${domain}`;

export const ConfigByEnv: EnvConfig = {
  CDN: `${protocol}://cdn-apps-test.${domain}/assets`,
  API: `${protocol}://api-${fullDomain}`,
  SOCKET_API: `wss://socket-${fullDomain}/socket`,
  GOOGLE_ANALYTICS_ID: 'UA-139547065-1',
  ENV: 'TEST',
  DOMAIN: `${domain}`,
  SUB_DOMAIN: {
    APP: `${protocol}://${fullDomain}`,
    MYACCOUNT: `${protocol}://myaccount-${fullDomain}`,
    MEDIA: `${protocol}://photos-${fullDomain}`,
    SOCIAL: `${protocol}://social-${fullDomain}`,
    CHAT: `${protocol}://chat-${fullDomain}`,
    CONTACT: `${protocol}://contacts-${fullDomain}`,
    NOTE: `${protocol}://notes-${fullDomain}`
  }
};
