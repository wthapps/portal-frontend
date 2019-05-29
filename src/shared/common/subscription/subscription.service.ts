import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class SubscriptionService {
  path = 'account/payment/subscriptions';

  constructor(protected apiBaseService: ApiBaseService) { }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get(`${this.path}/get_current`);
  }

  upgrade(subscription: any): Observable<any> {
    return this.apiBaseService.post(`${this.path}/upgrade`, {subscription: subscription});
  }

  cancel(subscription: any): Observable<any> {
    return this.apiBaseService.delete(`${this.path}/cancel`, {subscription: subscription});
  }
}
