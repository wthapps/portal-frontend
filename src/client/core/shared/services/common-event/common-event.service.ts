import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CommonEvent } from './common-event';
import { CommonEventHandler } from './common-event-handler';


/**
 * @service CommonEventService
 */


@Injectable()
export class CommonEventService {
  channels: any = [];
  token: any = -1;
  // this.commonEvent.subscribe(['sampleChannel'], (test: any) => { console.log(test)});
  subscribe(channels: any, func: any) {
    let tokens = [];
    for(let channel of channels) {
      if(!this.channels[channel]) {
        this.channels[channel] = [];
      }
      this.token = this.token + 1;
      tokens.push(this.token);
      this.channels[channel].push({token: this.token, func: func});
    }
    return tokens;
  }
  // this.commonEvent.next(['sampleChannel'], data);
  next(channels: any, event: any) {
    for(let channel of channels) {
      if(!this.channels[channel]) {
        continue;
      }
      let subscribers=this.channels[channel]
      let len=subscribers ? subscribers.length:0;
      while(len--) {
        subscribers[len].func(event);
      }
    }
    return this;
  }

  // alias for next
  publish(channels: any, event: any) {
    this.next(channels, event);
    return this;
  }

  // Don't use broadcast except really need
  // this.commonEvent.broadcast(data);
  broadcast(event: any) {
    for(let i in this.channels) {
      for(let j in this.channels[i]) {
        this.channels[i][j].func(event);
      }
    }
  }

  // this.commonEvent.unsubscribe([1, 3]);
  unsubscribe(tokens: any) {
    for(let i in this.channels) {
      for(let j in this.channels[i]) {
        for(let token of tokens) {
          if (this.channels[i][j].token == token) {
            this.channels[i].splice(j, 1);
          }
        }
      }
    }
  }
}
