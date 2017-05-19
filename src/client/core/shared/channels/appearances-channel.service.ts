import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class AppearancesChannelService extends CableService {

  constructor(private userService: UserService, private storageService: StorageService) {
    super();
  }

  subscribe() {
    console.debug('Start channel appearance');
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService.profile.uuid);
      let _this = this;
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
            _this.saveData(data);
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


