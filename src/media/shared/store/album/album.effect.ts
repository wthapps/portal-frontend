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
import { saveAs } from 'file-saver';

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

  constructor(private actions$: Actions,
              private mediaObjectService: MediaObjectService,
              private albumService: AlbumService) {
  }

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
        .catch(error => of(new albumActions.GetFail()));
    });

  @Effect()
  getAll$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.GET_ALL)
    .map((action: albumActions.GetAll) => action.payload)
    .switchMap(payload => {
      if (payload.objectType === 'album') {
        return this.albumService.getAll(payload)
          .map(response => new albumActions.GetAllSuccess({...response, ...payload}))
          .catch(error => of(new albumActions.GetAllFail()));
      } else {
        return this.albumService.getPhotosByAlbum(payload.object.id)
          .map(response => new albumActions.GetAllSuccess({...response, ...payload}))
          .catch(error => {

          });
      }
    });

  @Effect()
  addToDetailObjects$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.ADD_TO_DETAIL_OBJECTS)
    .map((action: albumActions.AddToDetailObjects) => action.payload)
    .switchMap(payload => {
      return this.albumService.addPhotos({...payload})
        .map(response => new albumActions.AddManySuccess(...response))
        .catch(error => {

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
  updateMany$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.UPDATE_MANY)
    .map((action: albumActions.UpdateMany) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.update(state, false, 'media')
        .map(response => {
          return new albumActions.UpdateManySuccess({...response});
        });
    });

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.DELETE)
    .map((action: albumActions.Delete) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.delete(state, false, 'media')
        .map(response => {
          return new albumActions.DeleteSuccess({...response});
        });
    });

  @Effect()
  deleteMany$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.DELETE_MANY)
    .map((action: albumActions.Delete) => action.payload)
    .switchMap(payload => {
      return this.mediaObjectService.deleteMany({objects: payload.selectedObjects}, 'media')
        .map(response => {
          return new albumActions.DeleteManySuccess({data: payload.selectedObjects});
        });
    });

  @Effect()
  removeFromDetailObjects$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.REMOVE_FROM_DETAIL_OBJECTS)
    .map((action: albumActions.RemoveFromDetailObjects) => action.payload)
    .switchMap(payload => {
      return this.albumService.removePhotos({
        album: payload.object,
        photos: payload.selectedObjects,
        delete_child: payload.delete_child || false
      })
        .map(response => {
          return new albumActions.DeleteManySuccess({data: payload.selectedObjects});
        });
    });

  @Effect()
  download$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.DOWNLOAD)
    .map((action: albumActions.Download) => action.payload)
    .switchMap(payload => {
      if (payload.selectedObjects && payload.selectedObjects.length > 0) {
        payload.selectedObjects.forEach(file => {
          return this.mediaObjectService.download({id: file.id}).subscribe(
            (response: any) => {
              const blob = new Blob([response], {type: file.content_type});
              saveAs(blob, file.name + '.' + file.extension);
            },
            (error: any) => {

            }
          );
        });
      } else {
        return null;
      }
    });

  @Effect()
  favorite$: Observable<Action> = this.actions$
    .ofType(albumActions.ActionTypes.FAVORITE)
    .map((action: albumActions.Favorite) => action.payload)
    .switchMap(payload => {
      return this.mediaObjectService.favourite({objects: payload.selectedObjects, mode: payload.mode})
        .map(response => {
            return new albumActions.FavoriteSuccess({...payload, data: response.data });
          },
          (error: any) => {
            console.log('error: ', error);
          }
        );
    });
}
