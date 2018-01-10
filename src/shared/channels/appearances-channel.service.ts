import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';

declare let App: any;
declare let $: any;

@Injectable()
export class AppearancesChannelService extends CableService {

  constructor(private userService: UserService, private storageService: StorageService) {
    super();
  }

  subscribe() {
    if(this.userService.loggedIn && this.userService.getSyncProfile()) {
      this.createConnectionInstance(this.userService.getSyncProfile().uuid);
      let thisCopy = this;
      App.personal_appearances = App.cable.subscriptions.create(
        {channel: 'AppearancesChannel'},
        {
          connected: function(){
            console.log('connected');
          },
          disconnected: function(){
            console.log('disconnected');
          },
          received: function(data:any){
            console.log('received', data);
            thisCopy.saveData(data);
          }
        }
      );
    }
  }

  unsubscribe() {
    App.personal_appearances.unsubscribe();
  }

  saveData(data:any) {
    this.storageService.save('users_online', data.users);
  }
}


