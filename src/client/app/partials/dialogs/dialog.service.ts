import {Injectable} from '@angular/core';

@Injectable()
export class DialogService {
  activate:(message?:string, title?:string, okText?:string, cancelText?:string) => Promise<boolean>;
}
