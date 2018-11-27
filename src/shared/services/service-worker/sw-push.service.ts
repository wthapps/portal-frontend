import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@env/environment';
import { ApiBaseService } from '../apibase.service';

@Injectable()
export class SwPushService {
  public_key: string = environment.keys.vapid_public_key;
  readonly url: string = 'common/notification_subscriptions';

  constructor(private swPush: SwPush,
    private api: ApiBaseService ) {
    console.log('inside SwPush service ...');
    this.requestSubscription();
  }

  requestSubscription() {
    if (this.swPush.isEnabled) {
      console.log('trigger web push ...');
      const module_name = window.location.origin;
      this.swPush
        .requestSubscription({ serverPublicKey: this.public_key })
        .then(subscription => {
          console.log('pushSub: ', subscription);
          this.createSubscription(module_name, subscription);
        })
        .catch(err => {
          console.error('error: ', err);
        });
    }
  }

  createSubscription(module_name: string, subscription: PushSubscription): Promise<any> {
    return this.api.post(`${this.url}`, {module_name, subscription}).toPromise().then(res => console.log('res: ', res));

  }

  // For testing purpose
  pushMessage(module_name, payload) {
    this.swPush
    .requestSubscription({ serverPublicKey: this.public_key })
    .then(subscription => {
      console.log('pushSub: ', subscription);
      return this.api.post(`${this.url}/send_message`, {module_name, payload}).toPromise().then(res => console.log('res: ', res));
    })
    .catch(err => {
      console.error('error: ', err);
    });
  }
}
