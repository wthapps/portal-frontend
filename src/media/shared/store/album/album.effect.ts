import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import { Observable }             from 'rxjs/Observable';
import { of }                     from 'rxjs/observable/of';
import * as albumActions         from './album.action';
import { AlbumService } from '@media/shared/services/album.service';
import { MediaObjectService } from '@media/shared/container/media-object.service';

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
export class AlbumEffects {

  constructor(
    private actions$: Actions,
    private mediaObjectService: MediaObjectService,
    private albumService: AlbumService
  ) {}

  /**
   * Photo
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.GET)
    .map((action: albumActions.Get) => action.payload)
    .switchMap((state: any) => {
      return this.albumService.getAlbum(state)
        .map(response => new albumActions.GetSuccess(response))
        .catch(error  => of(new albumActions.GetFail()));
    });

  @Effect()
  getAll$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.GET_ALL)
    .map((action: albumActions.GetAll) => action.payload)
    .switchMap(state => {
      if (state.objectType === 'album') {
        return this.albumService.getAll(state)
          .map(response => new albumActions.GetAllSuccess({...response, ...state}))
          .catch(error => of(new albumActions.GetAllFail()));
      } else {
          return this.albumService.getPhotosByAlbum(state.object.id)
            .map(response => new albumActions.GetAllSuccess({...response, ...state}))
            .catch(error  => {

            });
        }
    });

  @Effect()
  addToDetailObjects$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.ADD_TO_DETAIL_OBJECTS)
    .map((action: albumActions.AddToDetailObjects) => action.payload)
    .switchMap(state => {
      return this.albumService.addToAlbum(state.object.id, state.photos)
        .map(response => new albumActions.AddToDetailObjectsSuccess(...response))
        .catch(error  => {

        });
    });


  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.UPDATE)
    .map((action: albumActions.Update) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.update(state, false, 'media')
        .map(response => {
          return new albumActions.UpdateSuccess({...response});
        });
    });

  @Effect()
  removeFromDetailObjects$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.REMOVE_FROM_DETAIL_OBJECTS)
    .map((action: albumActions.RemoveFromDetailObjects) => action.payload)
    .switchMap(state => {
      return this.albumService.removeFromAlbum(state.object.id, {photos: state.selectedObjects, type: 'delete' } )
        .map(response => {
          return new albumActions.RemoveFromDetailObjectsSuccess({...response});
        });
    });
}
