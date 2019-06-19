import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Constants } from '@shared/constant';
import { SubscriptionService } from '../common/subscription/subscription.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SubscriptionGuard implements CanActivate, CanActivateChild {
  subscriptionAlertUrl = 'payment/subscription/alert';

  constructor(private router: Router, private subscriptionService: SubscriptionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkSubscription();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  private checkSubscription(): Observable<boolean> | Promise<boolean> | boolean {
    return this.subscriptionService.getCurrent().pipe(
      map(response => {
      const subscription = response.data.attributes;
      if (!subscription) {
        return false;
      }
      switch (subscription.status) {
        case 'CANCELED':
          this.redirectToExpiredSubscription('canceled');
          break;
        case 'EXPIRED':
          this.redirectToExpiredSubscription('expired');
          break;
      }
      return true;
    }, error => {
      return false;
    }));
  }

  private redirectToExpiredSubscription(alertType: 'canceled' | 'expired') {
    if (location.href.indexOf(Constants.baseUrls.myAccount) > -1) {
      this.router.navigate([this.subscriptionAlertUrl], {
        queryParams: { alertType: alertType, success: false }}
      ).then();
    } else {
      location.href = `${Constants.baseUrls.myAccount}/${this.subscriptionAlertUrl}?alertType=${alertType}&success=false`;
    }
  }
}
