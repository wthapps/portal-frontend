export * from './config';
export * from './wth-constants'
export * from '../partials/dialogs/index';
export * from '../partials/toast/index';
export * from '../partials/loading/index';
export * from './services/apibase.service';
export * from './services/user.service';
export * from './services/auth.service';
export * from './auth.guard';
export * from './constants';
export * from './validator/custom-validators';
export * from './event-emitter-args';
export * from './event-emitter';
export * from './stream-emitter';
export * from './wth.join.us.component';

import {ApiBaseService}       from './services/apibase.service';
import {UserService}          from './services/user.service';
import {AuthService}          from './services/auth.service';
import {AuthGuard}            from './auth.guard';
import {DialogService}        from '../partials/dialogs/index';
import {ToastsService}        from '../partials/toast/index';
import {LoadingService}       from '../partials/loading/index';

export const APP_SHARED_PROVIDERS = [
  ApiBaseService,
  UserService,
  DialogService,
  ToastsService,
  LoadingService,
  AuthService,
  AuthGuard
];
