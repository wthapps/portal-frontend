/**
 * demo RC4 http://embed.plnkr.co/h0o2IuoZYvXGtC1ejQBl/
 */
import {provideRouter, RouterConfig} from '@angular/router';

import {AboutRoutes}        from './+about/index';
import {HomeRoutes}         from './+home/index';
import {SupportRoutes}      from './+support/index';
import {ComingsoonRoutes}   from './+comingsoon/index';
import {PoliciesRoutes}     from './+policies/index';
import {WelcomeRoutes}      from './+welcome/index';
import {ContactRoutes}      from './+contact/index';
import {
  LoginRoutes,
  authProviders
}                           from './+login/index';
import {RegisterRoutes}     from './+register/index';
import {AccountRoutes}      from './+account/index';

import {CanDeactivateGuard} from './shared/index';

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
  authProviders,
  CanDeactivateGuard
];
