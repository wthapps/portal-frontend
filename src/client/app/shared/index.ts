/**
 * This barrel file provides the exports for the shared resources (services, components).
 */
export * from './config/env.config';
export * from './config/constants';
export * from './name-list/index';
export * from './navbar/index';
export * from './toolbar/index';
export * from './services/apibase.service';
export * from './services/user.service';
export * from './services/redirect.service';

export * from '../partials/dialogs/index';
export * from '../partials/toast/index';
export * from '../partials/loading/index';

export * from './wth.join.us.component';



import {ApiBaseService}       from './services/apibase.service';
import {UserService}          from './services/user.service';
import {RedirectService}      from './services/redirect.service';

import {DialogService}        from '../partials/dialogs/index';
import {ToastsService}        from '../partials/toast/index';
import {LoadingService}       from '../partials/loading/index';



export const APP_SHARED_PROVIDERS = [
  ApiBaseService,
  UserService,
  DialogService,
  ToastsService,
  LoadingService,
  RedirectService
];
