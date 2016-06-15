import {Injectable} from '@angular/core';

@Injectable()
export class TopMessageService {
  public type:any = {
    info: 'info',
    danger: 'danger',
    warning: 'warning',
    success: 'success'
  };
  activate:(type?:string, message?:string, close?:boolean) => Promise<boolean>;

}
