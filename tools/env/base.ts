import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  // Sample API url
  API: 'http://localhost:4000',
  URL: {
    app: 'http://localhost:3000',
    myAccount: 'http://localhost:3100',
    zone: 'http://localhost:3200',
  }
};

export = BaseConfig;

