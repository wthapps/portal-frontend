import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { ChannelActionFactoryService } from './factory/channel_action_factory.service';
import { ServiceManager } from '../services/service-manager';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class ChannelService extends CableService {

  constructor(private userService: UserService, private serviceManager: ServiceManager) {
    super();
  }

  subscribe() {
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService.profile.uuid);
      let thisCopy = this;
      App.channel = App.cable.subscriptions.create(
        {channel: 'Channel'},
        {
          connected: function() {
            console.log('connected');
          },
          disconnected: function() {
            console.log('disconnected');
          },
          received: function(data: any) {
            console.log('received', data);
            let factory = new ChannelActionFactoryService();
            let action = factory.create(data, thisCopy.serviceManager);
            if (action) {
              if(action.process) {
                action.process();
              } else {
                action.update(data);
              }
            }
          }
        }
      );
    }
  }

  unsubscribe() {
    App.channel.unsubscribe();
  }
}


