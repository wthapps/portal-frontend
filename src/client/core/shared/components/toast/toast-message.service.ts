/*import { Injectable } from '@angular/core';

@Injectable()
export class ToastsService {

  defaults: any = {
    icon: {
      info: 'info',
      danger: 'error',
      warning: 'warn',
      success: 'success'
    }
    /!*, options: {
     life: 3000
     }*!/
  };

  set: (icon: string, summary: string, detail: string) => Promise<boolean>;

  info(summary: string, detail: string = '') {
    this.set(this.defaults.icon.info, summary, detail);
  }

  danger(summary: string, detail: string = '') {
    this.set(this.defaults.icon.danger, summary, detail);
  }

  warning(summary: string, detail: string = '') {
    this.set(this.defaults.icon.warning, summary, detail);
  }

  success(summary: string, detail: string = '') {
    this.set(this.defaults.icon.success, summary, detail);
  }


  /!*info(message: string, option: any = this.defaults.options) {
   if (option) this.attachOverrides(option);
   this.set(message, this.defaults.options, this.defaults.type.info);
   }
   // Attach all the overrides to options
   attachOverrides(option: any) {

   // check key option
   Object.keys(option).forEach(a => {
   this.defaults.options[a] = option[a];
   });
   }*!/
}*/

import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class ToastsService {

  defaults: any = {
    icon: {
      info: 'info',
      danger: 'error',
      warning: 'warn',
      success: 'success'
    }
  };

  constructor(private messageService: MessageService) {
  }

  info(summary: string, detail: string = '') {
    this.messageService.add({
      severity: this.defaults.icon.info,
      summary: summary,
      detail: detail
    });
  }

  danger(summary: string, detail: string = '') {
    this.messageService.add({
      severity: this.defaults.icon.danger,
      summary: summary,
      detail: detail
    });
  }

  warning(summary: string, detail: string = '') {
    this.messageService.add({
      severity: this.defaults.icon.warning,
      summary: summary,
      detail: detail
    });
  }

  success(summary: string, detail: string = '') {
    this.messageService.add({
      severity: this.defaults.icon.success,
      summary: summary,
      detail: detail
    });
  }


  /*info(message: string, option: any = this.defaults.options) {
   if (option) this.attachOverrides(option);
   this.set(message, this.defaults.options, this.defaults.type.info);
   }
   // Attach all the overrides to options
   attachOverrides(option: any) {

   // check key option
   Object.keys(option).forEach(a => {
   this.defaults.options[a] = option[a];
   });
   }*/
}
