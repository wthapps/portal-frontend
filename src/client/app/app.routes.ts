import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';
import {
  LoginRoutes
  //, authProviders
} from './login/index';
import { RegisterRoutes } from './register/index';
import { ProductsRoutes } from './products/index';
import { PricingRoutes } from './pricing/index';
import { ContactRoutes } from './contact/index';
import { SupportRoutes } from './support/index';
import { PoliciesRoutes } from './policies/index';
import { WelcomeRoutes } from './welcome/index';
import { ComingsoonRoutes } from './comingsoon/index';

import { AccountRoutes } from './account/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...LoginRoutes,
  ...RegisterRoutes,
  ...ProductsRoutes,
  ...PricingRoutes,
  ...ContactRoutes,
  ...SupportRoutes,
  ...PoliciesRoutes,
  ...WelcomeRoutes,
  ...ComingsoonRoutes,
  ...AccountRoutes,
];
