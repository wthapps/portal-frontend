import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { UserService } from '../services/user.service';

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
        {channel: 'AppearancesChannel'},
        {
          connected: function(){
            // console.log('connected');
          },
          disconnected: function(){
            // console.log('disconnected');
          },
          received: function(data:any){
            // console.log('received', data);
          }
        }
      );
    }
  }

  unsubscribe() {
    App.personal_appearances.unsubscribe();
  }
}


