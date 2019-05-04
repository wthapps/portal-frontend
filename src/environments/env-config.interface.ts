// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfigSubDomain {
  APP?: string;
  MYACCOUNT?: string;
  MEDIA?: string;
  SOCIAL?: string;
  CHAT?: string;
  CONTACT?: string;
  NOTE?: string;
}

export interface EnvConfig {
  CDN?: string;
  API?: string;
  SOCKET_API?: string;
  GOOGLE_ANALYTICS_ID?: string;
  ENV?: string;
  DOMAIN?: string;
  SUB_DOMAIN?: EnvConfigSubDomain;
  RES?: string;
}
