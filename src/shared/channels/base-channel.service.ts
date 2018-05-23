import { Injectable } from '@angular/core';
import { CableService } from './cable.service';

declare let App: any;

@Injectable()
export class BaseChannelService extends CableService {
  requireLogin: boolean = true;

  constructor() {
    super();
    console.log('base channel service:::', App);
  }

  send(channel: any, data: any) {
    App[channel].send(data);
  }

  unsubscribe(channel: any) {
    App[channel].unsubscribe();
  }
}
