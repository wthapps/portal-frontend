import { Injectable } from '@angular/core';
import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { ChannelActionFactoryService } from './factory/channel_action_factory.service';
import { ServiceManager } from '../services/service-manager';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class ChannelService extends CableService {
  constructor(
    private userService: UserService,
    private serviceManager: ServiceManager
  ) {
    super();
  }

  subscribe() {
    const profile = this.userService.getSyncProfile();
    if (this.userService.loggedIn && profile) {
      this.createConnectionInstance(profile.uuid);

      const self = this;

      App.channel = App.cable.subscriptions.create(
        'CommonChannel',
        {
          connected: () => {
            console.log('connected');
          },
          disconnected: () => {
            console.log('disconnected');
          },
          received: (data: any) => {
            const factory = new ChannelActionFactoryService();
            const action = factory.create(data, self.serviceManager);
            if (action) {
              if (action.process) {
                action.process(data);
              }
            }
          }
        }
      );
    }
  }

  unsubscribe() {
    if (App.channel) { App.channel.unsubscribe(); }
  }
}
