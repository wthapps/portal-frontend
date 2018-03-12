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
  GetAccounts, GetAccountsSuccess, GetAccountsFail,
  Add, AddSuccess, AddFail,
  AddMany, AddManySuccess, AddManyFail,
  Update, UpdateSuccess, UpdateFail,
  Delete, DeleteSuccess, DeleteFail
}       from './account.action';
import { AccountService } from '../../shared/account/account.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';

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

  constructor (private actions$: Actions, private accountService: AccountService, private toastsService: ToastsService) {}

  /**
   * Photo
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GET)
    .map((action: Get) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.get(state)
        .map(response => new GetSuccess(response))
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

  @Effect()
  add$: Observable<Action> = this.actions$
    .ofType(ActionTypes.ADD)
    .map((action: Add) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.create(state)
        .map(response => {
          this.toastsService.success('You added account successfully!');
          return new AddSuccess(response);
        })
        .catch(error  => of(new AddFail(error)));
    });

  @Effect()
  addMany$: Observable<Action> = this.actions$
    .ofType(ActionTypes.ADD_MANY)
    .map((action: AddMany) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.create(state, true)
        .map(response => {
          this.toastsService.success('You added account successfully!');
          return new AddManySuccess(response);
        })
        .catch(error  => of(new AddManyFail(error)));
    });

  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(ActionTypes.UPDATE)
    .map((action: Update) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.update(state)
        .map(response => {
          this.toastsService.success('You updated account successfully!');
          return new UpdateSuccess(response);
        })
        .catch(error  => of(new UpdateFail(error)));
    });

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(ActionTypes.DELETE)
    .map((action: Delete) => action.payload)
    .switchMap((state: any) => {
      return this.accountService.delete(0, state)
        .map(response => {
          this.toastsService.success('You deleted account successfully!');
          return new DeleteSuccess(response);
        })
        .catch(error  => of(new DeleteFail(error)));
    });

}
