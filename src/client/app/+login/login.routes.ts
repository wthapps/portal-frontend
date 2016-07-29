import {RouterConfig}     from '@angular/router';

import {LoginComponent}   from './index';

import {
  AuthGuard,
  UserService,
  AuthService,
  RedirectService
}                           from '../shared/index';

export const LoginRoutes:RouterConfig = [
  {
    path: 'login',
    component: LoginComponent
  }
];

export const authProviders = [
  AuthGuard,
  AuthService,
  UserService,
  RedirectService
];
