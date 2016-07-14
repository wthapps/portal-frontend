import {provideRouter, RouterConfig} from '@angular/router';

import {AboutRoutes}        from './+about/index';
import {HomeRoutes}         from './+home/index';
import {SupportRoutes}      from './+support/index';
import {ComingsoonRoutes}   from './+comingsoon/index';
import {PoliciesRoutes}     from './+policies/index';
import {WelcomeRoutes}      from './+welcome/index';
import {ContactRoutes}      from './+contact/index';
import {LoginRoutes}        from './+login/index';
import {RegisterRoutes}     from './+register/index';
import {AccountRoutes}      from './+account/index';

const routes:RouterConfig = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...SupportRoutes,
  ...ComingsoonRoutes,
  ...PoliciesRoutes,
  ...WelcomeRoutes,
  ...ContactRoutes,
  ...LoginRoutes,
  ...RegisterRoutes,
  ...AccountRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
