import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';
import {
  LoginRoutes
  //, authProviders
} from './login/index';
import { RegisterRoutes } from './register/index';


export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...LoginRoutes,
  ...RegisterRoutes
];
