import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Injectable }       from '@angular/core';
import { Effect, Actions }  from '@ngrx/effects';
import { Action }           from '@ngrx/store';
import { Observable }       from 'rxjs/Observable';
import { of }               from 'rxjs/observable/of';
import * as actions         from './auth.action';
import { Store }            from '@ngrx/store';
import * as store           from '../index';
import { User } from '@wth/shared/shared/models';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authApiClient: any,
    ) {}

  /**
   * Login effect
   */
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOGIN)
    .map((action: actions.Login) => action.payload)
    .switchMap(state => {
      return this.authApiClient.login(state)
        .map(user    => new actions.LoginSuccess(new User(user)))
        .catch(error => of(new actions.LoginFail()));
    });

  /**
   * Logout effect
   */
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOGOUT)
    .map((action: actions.Logout) => null)
    .switchMap(state => {
      return this.authApiClient.logout()
        .map(()      => new actions.LogoutSuccess())
        .catch(error => of(new actions.LogoutFail()));
    });
}
