import {Injectable} from '@angular/core';

@Injectable()
export class TopMessageService {
  public type:any = {
    info: 'info',
    danger: 'danger',
    warning: 'warning',
    success: 'success'
  };
  info:(message?:string, close?:boolean, type?:string = this.type.info) => Promise<boolean>;
  danger:(message?:string, close?:boolean, type?:string = this.type.danger) => Promise<boolean>;
  warning:(message?:string, close?:boolean, type?:string = this.type.warning) => Promise<boolean>;
  success:(message?:string, close?:boolean, type?:string = this.type.success) => Promise<boolean>;
}
