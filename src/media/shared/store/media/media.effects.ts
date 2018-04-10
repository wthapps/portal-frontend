import { Injectable }             from '@angular/core';
import { Effect, Actions }        from '@ngrx/effects';
import { Action }                 from '@ngrx/store';
import { Observable }             from 'rxjs/Observable';
import { of }                     from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as mediaActions         from './media.actions';
import { AlbumService } from '@media/shared/services/album.service';
import { MediaObjectService } from '@media/shared/container/media-object.service';
import { saveAs } from 'file-saver';
import { PhotoService } from '@wth/shared/services/photo.service';
import { SharingService } from '@media/shared/modal/sharing/sharing.service';

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
export class MediaEffects {

  constructor(
    private actions$: Actions,
    private mediaObjectService: MediaObjectService,
    private albumService: AlbumService,
    private photoService: PhotoService,
    private sharingService: SharingService
  ) {
  }

  /**
   * Get object
   */
  @Effect()
  get$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.GET)
    .map((action: mediaActions.Get) => action.payload)
    .switchMap((state: any) => {
      return this.albumService.getAlbum(state)
        .map(response => new mediaActions.GetSuccess(response))
        .catch(error => of(new mediaActions.GetFail()));
    });

  @Effect()
  getAll$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.GET_ALL)
    .map((action: mediaActions.GetAll) => action.payload)
    .switchMap(payload => {
        return this.mediaObjectService.getAll(payload.queryParams, payload.path)
          .map(response => new mediaActions.GetAllSuccess({...response, ...payload}));
    });

  @Effect()
  getMore$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.GET_MORE)
    .map((action: mediaActions.GetMore) => action.payload)
    .switchMap(payload => {
      if (payload.objectType === 'album') {
        return this.albumService.getAll('', payload.nextLink.replace(/^\//, ''))
          .map(response => new mediaActions.AddManySuccess({...response}))
          .catch(error => of(new mediaActions.GetAllFail()));
      } else {
        return this.albumService.getPhotosByAlbum(payload.object.id)
          .map(response => new mediaActions.AddManySuccess({...response}))
          .catch(error => {

          });
      }
    });


  @Effect()
  addToDetailObjects$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.ADD_TO_DETAIL_OBJECTS)
    .map((action: mediaActions.AddToDetailObjects) => action.payload)
    .switchMap(payload => {
      if (payload.album) {
        return this.albumService.addPhotos({...payload})
          .map(response => new mediaActions.AddManySuccess(...response))
          .catch(error => {

          });
      } else {
        return this.sharingService.addObjects({...payload})
          .map(response => new mediaActions.AddManySuccess(...response))
          .catch(error => {

          });
      }
    });

  @Effect()
  removeFromDetailObjects$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.REMOVE_FROM_DETAIL_OBJECTS)
    .map((action: mediaActions.RemoveFromDetailObjects) => action.payload)
    .switchMap(payload => {
      if (payload.album) {
        return this.albumService.removePhotos({
          album: payload.album,
          photos: payload.selectedObjects,
          delete_child: payload.delete_child || false
        })
          .map(response => {
            return new mediaActions.DeleteManySuccess({data: payload.selectedObjects});
          });
      } else {
        return this.sharingService.removeObjects({
          sharing: payload.object,
          objects: payload.selectedObjects,
          delete_child: payload.delete_child || false
        })
          .map(response => {
            return new mediaActions.DeleteManySuccess({data: payload.selectedObjects});
          });
      }
    });

  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.UPDATE)
    .map((action: mediaActions.Update) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.update(state, false, 'media')
        .map(response => {
          return new mediaActions.UpdateSuccess({...response});
        });
    });

  @Effect()
  updateMany$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.UPDATE_MANY)
    .map((action: mediaActions.UpdateMany) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.update(state, false, 'media')
        .map(response => {
          return new mediaActions.UpdateManySuccess({...response});
        });
    });

  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.DELETE)
    .map((action: mediaActions.Delete) => action.payload)
    .switchMap(state => {
      return this.mediaObjectService.delete(state, false, 'media')
        .map(response => {
          return new mediaActions.DeleteSuccess({...response});
        });
    });

  @Effect()
  deleteMany$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.DELETE_MANY)
    .map((action: mediaActions.Delete) => action.payload)
    .switchMap(payload => {
      return this.mediaObjectService.deleteMany({objects: payload.selectedObjects}, 'media')
        .map(response => {
          return new mediaActions.DeleteManySuccess({data: payload.selectedObjects});
        });
    });

  @Effect()
  download$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.DOWNLOAD)
    .map((action: mediaActions.Download) => action.payload)
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
  getAllFavorite: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.GET_ALL_FAVORITE)
    .map((action: mediaActions.GetAllFavorite) => action.payload)
    .switchMap(payload => {
      return this.mediaObjectService.getAllFavorite({...payload.queryParams})
        .map(response => {
            return new mediaActions.GetAllSuccess({...payload, ...response});
          },
          (error: any) => {
            console.log('error: ', error);
          }
        );
    });

  @Effect()
  favorite$: Observable<Action> = this.actions$
    .ofType(mediaActions.ActionTypes.FAVORITE)
    .map((action: mediaActions.Favorite) => action.payload)
    .switchMap(payload => {
      return this.mediaObjectService.favourite({objects: payload.selectedObjects, mode: payload.mode})
        .map(response => {
            return new mediaActions.FavoriteSuccess({...payload, data: response.data });
          },
          (error: any) => {
            console.log('error: ', error);
          }
        );
    });
}
