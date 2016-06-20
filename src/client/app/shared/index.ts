export * from './config';
export * from '../partials/dialogs/index';
export * from '../partials/topmessage/index';
export * from '../partials/loading/index';
export * from './services/apibase.service';
export * from './services/user.service';

import {ApiBaseService} from './services/apibase.service';
import {UserService} from './services/user.service';
import {DialogService} from '../partials/dialogs/index';
import {TopMessageService} from '../partials/topmessage/index';
import {LoadingService} from '../partials/loading/index';

export const APP_SHARED_PROVIDERS = [
  ApiBaseService,
  UserService,
  DialogService,
  TopMessageService,
  LoadingService
];
