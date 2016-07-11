import { provideRouter, RouterConfig } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { SupportRoutes } from './+support/index';

const routes: RouterConfig = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...SupportRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
