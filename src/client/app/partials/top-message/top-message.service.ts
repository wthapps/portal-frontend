import {Injectable} from '@angular/core';

@Injectable()
export class TopMessageService {
  activate:(type?:string, message?:string, close?:boolean) => Promise<boolean>;
}
