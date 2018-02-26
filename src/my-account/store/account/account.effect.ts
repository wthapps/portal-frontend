import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  ActionTypes,
  Get, GetSuccess, GetFail,
  GetAccounts, GetAccountsSuccess, GetAccountsFail
}       from './account.action';
import { AccountService } from '../../shared/account/account.service';

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
export class AccountEffects {

  constructor (private actions$: Actions, private accountService: AccountService) {}

  /**
   * Photo
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GET)
    .map((action: Get) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.get(state)
        .map(photo => new GetSuccess(photo))
        .catch(error  => of(new GetFail(error)));
    });

  @Effect()
  getAccounts$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GET_ACCOUNTS)
    .map((action: GetAccounts) => action.payload)
    .switchMap(state => {
      return this.accountService.getAccounts(state)
        .map(response => new GetAccountsSuccess(response))
        .catch(error  => of(new GetAccountsFail(error)));
    });
}
