import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import { Store }                  from '@ngrx/store';

import { Observable }             from 'rxjs/Observable';
import { of }                     from 'rxjs/observable/of';
import * as ObjectActions         from './object.action';
import * as store                 from '../index';
import { MediaObjectService } from '../../container/media-object.service';

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
export class ObjectEffects {

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private mediaService: MediaObjectService
  ) {}

  /**
   * Object
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(ObjectActions.GET)
    .map((action: ObjectActions.Get) => action.payload)
    .switchMap((state: any) => {
      return this.mediaService.get(state.id, 'sharings')
        .map(response => new ObjectActions.GetSuccess(response))
        .catch(error  => of(new ObjectActions.GetFail()));
    });

  @Effect()
  getAll$: Observable<Action> = this.actions$
    .ofType(ObjectActions.GET_ALL)
    .map((action: ObjectActions.GetAll) => action.payload)
    .switchMap(state => {
      return this.mediaService.getAll(state.url)
        .map(response => new ObjectActions.GetAllSuccess(...response))
        .catch(error  => of(new ObjectActions.GetAllFail()));
    });

  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(ObjectActions.UPDATE)
    .map((action: ObjectActions.Update) => action.payload)
    .switchMap(state => {
      return this.mediaService.update(state.selectedObject, false, 'sharings')
        .map(response => new ObjectActions.UpdateSuccess(...response))
        .catch(error  => of(new ObjectActions.UpdateFail));
    });

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(ObjectActions.DELETE)
    .map((action: ObjectActions.Delete) => action.payload)
    .switchMap(state => {
      if (state.selectedObjects.length > 1) {
        return this.mediaService.delete(0, state.selectedObjects)
          .map(response => new ObjectActions.DeleteSuccess(...response))
          .catch(error  => of(new ObjectActions.DeleteFail));
      } else {
        return this.mediaService.delete(state.selectedObjects[0].id, null, 'sharings')
          .map(response => new ObjectActions.DeleteSuccess(...response))
          .catch(error  => of(new ObjectActions.DeleteFail));
      }
    });
}
