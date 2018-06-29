


import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import { Store }                  from '@ngrx/store';

import { Observable,  of }             from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as photoActions         from './sharing.action';
import * as store                 from '../index';
import { PhotoService } from '@wth/shared/services';

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
export class SharingEffects {

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private photoService: PhotoService
  ) {}

  /**
   * Photo
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(photoActions.ActionTypes.GET).pipe(
    map((action: photoActions.Get) => action.payload),
    switchMap((state: any) => {
      return this.photoService.getPhoto(state).pipe(
        map(photo => new photoActions.GetSuccess(photo)),
        catchError(error  => of(new photoActions.GetFail())));
    }));

  @Effect()
  getAll$: Observable<Action> = this.actions$
    .ofType(photoActions.ActionTypes.GET_ALL)
    .pipe(
      map((action: photoActions.GetAll) => action.payload),
      switchMap(state => {
        return this.photoService.listPhoto(state)
          .pipe(
            map(response => new photoActions.GetAllSuccess(...response)),
            catchError(error  => of(new photoActions.GetAllFail()))
          );
      })
    );
}
