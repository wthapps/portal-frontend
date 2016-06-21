import {Injectable} from '@angular/core';

@Injectable()
export class TopMessageService {
  info:(message?:string, close?:boolean) => Promise<boolean>;
  danger:(message?:string, close?:boolean) => Promise<boolean>;
  warning:(message?:string, close?:boolean) => Promise<boolean>;
  success:(message?:string, close?:boolean) => Promise<boolean>;
}
