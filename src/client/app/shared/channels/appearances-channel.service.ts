import { Injectable }     from '@angular/core';
import { UserService } from '../../shared/index';
import { CableService } from './cable.service';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class AppearancesChannelService extends CableService {

  constructor(private userService: UserService) {
    super();
  }

  subscribe() {
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService);
      App.personal_appearances = App.cable.subscriptions.create(
        {channel: "AppearancesChannel"},
        {
          connected: function(){console.log('connected')},
          disconnected: function(){console.log('disconnected')},
          received: function(data){console.log('received', data)}
        }
      );
    }
  }

  unsubscribe() {
    App.personal_appearances.unsubscribe();
  }
}


