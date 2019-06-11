import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services';
import { map } from 'rxjs/operators';

@Injectable()
export class SubscriptionService {
  path = 'account/payment/subscriptions';

  subscription$: Observable<any>;
  private _subscription$: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(protected apiBaseService: ApiBaseService) {
    this.subscription$ = this._subscription$.asObservable();
  }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get(`${this.path}/get_current`).pipe(map(response => {
      this.setSubscription(response.data.attributes);
      return response;
    }));
  }

  upgrade(subscription: any): Observable<any> {
    return this.apiBaseService.post(`${this.path}/upgrade`, {subscription: subscription}).pipe(map(response => {
      this.setSubscription(response.data.attributes);
      return response;
    }));
  }

  cancel(subscription: any): Observable<any> {
    return this.apiBaseService.patch(`${this.path}/cancel`, {subscription: subscription});
  }

  continue(subscription: any): Observable<any> {
    return this.apiBaseService.patch(`${this.path}/continue`, {subscription: subscription});
  }

  canActivate(): boolean {
    return true;
  }

  setSubscription(subscription: any) {
    this._subscription$.next(subscription);
  }
}
