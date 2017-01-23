import { Injectable }     from '@angular/core';
import { StorageService } from './storage.service';

declare var _:any;

@Injectable()
export class HandlerService extends StorageService{
  handlers: any = {};
  prefix: string = "callbacks_";

  addListener(id:string, event:string, callback:any) {
    if(this.handlers[id] == undefined) {
      this.handlers[id] = callback;
      let callbacks = this.get(this.prefix + event);
      if(callbacks) {
        callbacks.push(this.handlers[id]);
        this.save(this.prefix + event, callbacks);
      } else {
        this.save(this.prefix + event, [this.handlers[id]]);
      }
    }
  }

  triggerEvent(event:string, res:any) {
    let callbacks = this.get(this.prefix + event);
    if (callbacks) {
      for(let handler of callbacks) {
        handler(res);
      }
    }
  }
}

