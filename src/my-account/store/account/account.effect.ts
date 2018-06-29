import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import { Observable,  of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
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
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';

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

  constructor (
    private actions$: Actions,
    private accountService: AccountService,
    private toastsService: ToastsService,
    private loadingService: LoadingService
  ) {}

  /**
   * Photo
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GET)
    .pipe(
      map((action: Get) => action.payload),
      switchMap((state: any) => {
        return this.accountService.get(state)
          .pipe(
            map(response => new GetSuccess(response)),
            catchError(error  => of(new GetFail(error)))
          );
      }));

  @Effect()
  getAccounts$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GET_ACCOUNTS).pipe(
    map((action: GetAccounts) => action.payload),
    switchMap(state => {
      this.loadingService.start();
      return this.accountService.getAccounts(state).pipe(
        map(response => {
          this.loadingService.stop();
          return new GetAccountsSuccess(response);
        }),
        catchError(response  => {
          this.loadingService.stop();
          this.toastsService.danger(response.error.error);
          return of(new GetAccountsFail(response));
        }));
    }));

  @Effect()
  add$: Observable<Action> = this.actions$
    .ofType(ActionTypes.ADD).pipe(
    map((action: Add) => action.payload),
    switchMap((state: any) => {
      return this.accountService.create(state).pipe(
        map(response => {
          this.toastsService.success('You added account successfully!');
          return new AddSuccess(response);
        }),
        catchError(error  => of(new AddFail(error))));
    }));

  @Effect()
  addMany$: Observable<Action> = this.actions$
    .ofType(ActionTypes.ADD_MANY).pipe(
    map((action: AddMany) => action.payload),
    switchMap((state: any) => {
      this.loadingService.start();
      return this.accountService.create(state, true).pipe(
        map(response => {
          this.loadingService.stop();
          this.toastsService.success('You added account successfully!');
          return new AddManySuccess(response);
        }),
        catchError(response  => {
          this.loadingService.stop();
          this.toastsService.danger(response.error.error);
          return of(new AddManyFail(response));
        }));
    }));

  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(ActionTypes.UPDATE).pipe(
    map((action: Update) => action.payload),
    switchMap((state: any) => {
      this.loadingService.start();
      return this.accountService.update(state).pipe(
        map(response => {
          this.loadingService.stop();
          this.toastsService.success('You updated account successfully!');
          return new UpdateSuccess(response);
        }),
        catchError(response  => {
          this.loadingService.stop();
          this.toastsService.success(response.error.error);
          return of(new UpdateFail(response));
        }));
    }));

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(ActionTypes.DELETE).pipe(
    map((action: Delete) => action.payload),
    switchMap((state: any) => {
      this.loadingService.start();
      return this.accountService.delete(0, state).pipe(
        map(response => {
          this.loadingService.stop();
          this.toastsService.success('You deleted account successfully!');
          return new DeleteSuccess(response);
        }),
        catchError(response  => {
          this.loadingService.stop();
          this.toastsService.danger(response.error.error);
          return of(new DeleteFail(response));
        }));
    }));

}
