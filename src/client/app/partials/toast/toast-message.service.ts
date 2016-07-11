import {Injectable} from '@angular/core';

import {
  ToastOptions,
  Toast
} from './index';

declare var $:any;

@Injectable()
export class ToastsService {

  defaults:any = {
    type: {
      info: 'info',
      danger: 'danger',
      warning: 'warning',
      success: 'success'
    },
    options: {
      timeOut: 0,
      lastOnBottom: false,
      clickToClose: true
    }
  };

  set:(message, option, type:string) => Promise<boolean>;

  info(message:string, option:ToastOptions = this.defaults.options) {
    if (option) this.attachOverrides(option);
    this.set(message, this.defaults.options, this.defaults.type.info);
  }

  danger(message:string, option:ToastOptions = this.defaults.options) {
    if (option) this.attachOverrides(option);
    this.set(message, this.defaults.options, this.defaults.type.danger);
  }

  warning(message:string, option:ToastOptions = this.defaults.options) {
    if (option) this.attachOverrides(option);
    this.set(message, this.defaults.options, this.defaults.type.warning);
  }

  success(message:string, option:ToastOptions = this.defaults.options) {
    if (option) this.attachOverrides(option);
    this.set(message, this.defaults.options, this.defaults.type.success);
  }

  // Attach all the overrides to options
  attachOverrides(option:ToastOptions) {

    // check key option
    Object.keys(option).forEach(a => {
      this.defaults.options[a] = option[a];
    });
  }
}
