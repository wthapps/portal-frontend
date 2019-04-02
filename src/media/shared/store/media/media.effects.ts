// import { Injectable }             from '@angular/core';
// import {throwError as observableThrowError,  Observable ,  of, from } from 'rxjs';
// import { map, switchMap, mergeMap, flatMap, catchError } from 'rxjs/operators';
// import { Effect, Actions, ofType }        from '@ngrx/effects';
// import { Action }                 from '@ngrx/store';

// import * as mediaActions         from './media.actions';
// import { AlbumService } from '@media/shared/service/album.service';
// import { MediaObjectService } from '@media/shared/container/media-object.service';
// import { saveAs } from 'file-saver';
// import { SearchService } from '@media/shared/service';
// // import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
// import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
// import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';

// /**
//  * Effects offer a way to isolate and easily test side-effects within your
//  * application. StateUpdates is an observable of the latest state and
//  * dispatched action. The `toPayload` helper function returns just
//  * the payload of the currently dispatched action, useful in
//  * instances where the current state is not necessary.
//  *
//  * If you are unfamiliar with the operators being used in these examples, please
//  * check out the sources below:
//  *
//  * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
//  * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
//  */

// @Injectable()
// export class MediaEffects {

//   constructor(
//     private actions$: Actions,
//     private mediaObjectService: MediaObjectService,
//     private albumService: AlbumService,
//     private sharingService: SharingService,
//     private searchService: SearchService,
//     private toastsService: ToastsService,
//     private loading: LoadingService
//   ) {
//   }

//   /**
//    * Get object
//    */
//   @Effect()
//   get$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.GET),
//     map((action: mediaActions.Get) => action.payload),
//     switchMap((state: any) => {
//       return this.albumService.getAlbum(state)
//         .pipe(
//           map(response => new mediaActions.GetSuccess(response)),
//           catchError(error => of(new mediaActions.GetFail()))
//         );
//     })
//   );

//   @Effect()
//   getAll$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.GET_ALL),
//     map((action: mediaActions.GetAll) => action.payload),
//     switchMap(payload => {
//       return this.mediaObjectService.getAll(payload.queryParams, payload.path)
//       .pipe(
//         map(response => {
//           return new mediaActions.GetAllSuccess({...response, ...payload});
//         })
//       );
//     })
//   );

//   @Effect()
//   getMore$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.GET_MORE),
//     map((action: mediaActions.GetMore) => action.payload),
//     switchMap(payload => {
//     if (payload.nextLink) {
//       return this.mediaObjectService.loadMore(payload.nextLink.replace(/^\//, ''))
//         .pipe(
//           map(response => new mediaActions.GetMoreSuccess({...response})),
//           catchError(error => null)
//         );
//     } else {
//       return new Observable((observer) => {
//         observer.next = (x) => {
//           return [];
//         };
//       });
//     }})
//   );

//   @Effect()
//   search$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.SEARCH),
//     map((action: mediaActions.Search) => action.payload),
//     switchMap(payload => {
//     return this.searchService.search(payload.path, payload.queryParams)
//       .pipe(map(response => new mediaActions.GetAllSuccess({...response, ...payload})));
//     })
//   );


//   @Effect()
//   addToDetailObjects$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.ADD_TO_DETAIL_OBJECTS),
//     map((action: mediaActions.AddToDetailObjects) => action.payload),
//     mergeMap(payload => {
//     if (payload.album) {
//       return this.albumService.addPhotos({...payload})
//         .pipe(
//           map((response: any) => {
//             this.toastsService.success('You added item(s) successful!');
//             return new mediaActions.AddManySuccess(...response);
//           })
//         );
//     } else {
//       return this.sharingService.addObjects({...payload})
//         .pipe(map((response: any) => {
//           this.toastsService.success('You added item(s) successful!');
//           return new mediaActions.AddManySuccess(...response);
//         })
//         );
//     }})
//   );

//   @Effect()
//   removeFromDetailObjects$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.REMOVE_FROM_DETAIL_OBJECTS),
//     map((action: mediaActions.RemoveFromDetailObjects) => action.payload),
//     mergeMap(payload => {
//       if (payload.album) {
//         return this.albumService.removePhotos({
//           album: payload.album,
//           photos: payload.selectedObjects,
//           delete_child: payload.delete_child || false
//         })
//           .map(response => {
//             this.toastsService.success('You removed item(s) successful!');
//             return new mediaActions.DeleteManySuccess(payload);
//           });
//       } else {
//         return this.sharingService.removeObjects({
//           sharing: payload.object,
//           objects: payload.selectedObjects,
//           delete_child: payload.delete_child || false
//         })
//           .map(response => {
//             this.toastsService.success('You removed item(s) successful!');
//             return new mediaActions.DeleteManySuccess(payload);
//           });
//       }
//     })
//   );

//   @Effect()
//   update$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.UPDATE),
//     map((action: mediaActions.Update) => action.payload),
//     mergeMap(state => {
//       return this.mediaObjectService.update(state, false, 'media')
//         .pipe(
//           map(response => {
//             this.toastsService.success('You updated item successful!');
//             return new mediaActions.UpdateSuccess({...response});
//           })
//         );
//     })
//   );

//   @Effect()
//   updateMany$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.UPDATE_MANY),
//     map((action: mediaActions.UpdateMany) => action.payload),
//     mergeMap(state => {
//       return this.mediaObjectService.update(state, false, 'media')
//         .pipe(
//           map(response => {
//             this.toastsService.success('You updated items successful!');
//             return new mediaActions.UpdateManySuccess({...response});
//           })
//         );
//     })
//     );

//   @Effect()
//   delete$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.DELETE),
//     map((action: mediaActions.Delete) => action.payload),
//     mergeMap(state => {
//     return this.mediaObjectService.delete(state, false, 'media')
//       .pipe(
//         map(response => {
//           this.toastsService.success('You deleted item successful!');
//           return new mediaActions.DeleteSuccess({...response});
//         })
//       );
//     })
//   );

//   @Effect()
//   deleteMany$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.DELETE_MANY),
//     map((action: mediaActions.Delete) => action.payload),
//     mergeMap(payload => {
//     this.loading.start();
//     return this.mediaObjectService.deleteMany({objects: payload.selectedObjects}, 'media')
//       .pipe(
//         map(response => {
//           this.loading.stop();
//           this.toastsService.success('You deleted items successful!');
//           return new mediaActions.DeleteManySuccess(payload);
//         })
//       );
//     })
//   );

//   @Effect()
//   download$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.DOWNLOAD),
//     map((action: mediaActions.Download) => action.payload),
//     switchMap(payload => {
//       if (payload.selectedObjects && payload.selectedObjects.length > 0) {
//         const result = [];
//         payload.selectedObjects.forEach(file => {
//           this.mediaObjectService.download({id: file.id}).subscribe(
//             (response: any) => {
//               const blob = new Blob([response], {type: file.content_type});
//               saveAs(blob, file.name + '.' + file.extension);
//               result.push(response);
//             },
//             (error: any) => {
//               return observableThrowError(error);
//             }
//           );
//         });
//       return from(result);
//     } else {
//       return null;
//     }})
//   );

//   @Effect()
//   getAllFavorite: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.GET_ALL_FAVORITE),
//     map((action: mediaActions.GetAllFavorite) => action.payload),
//     switchMap(payload => {
//     return this.mediaObjectService.getAllFavorite({...payload.queryParams})
//       .map(response => {
//           return new mediaActions.GetAllSuccess({...payload, ...response});
//         },
//         (error: any) => {
//           console.log('error: ', error);
//         }
//       );
//     })
//   );

//   @Effect()
//   favorite$: Observable<Action> = this.actions$.pipe(
//     ofType(mediaActions.ActionTypes.FAVORITE),
//     map((action: mediaActions.Favorite) => action.payload),
//     flatMap(payload => {
//     // return this.mediaObjectService.favourite({objects: payload.selectedObjects, mode: payload.mode})
//     if (payload.mode === 'add') {
//       const data: FavouriteParams = payload.selectedObjects.map(item => {return {id: item.id, model: item.model}});
//       return this.mediaObjectService.favorite({objects: data, mode: payload.mode})
//         .map(response => {
//             return new mediaActions.FavoriteSuccess({...payload, data: response.data });
//           },
//           (error: any) => {
//             console.log('error: ', error);
//           }
//         );
//     } else {
//       const data: FavouriteParams = payload.selectedObjects.map(item => {return {id: item.id, model: item.model}});
//       return this.mediaObjectService.unfavorite({objects: data, mode: payload.mode})
//         .map(response => {
//             return new mediaActions.FavoriteSuccess({...payload, data: response.data });
//           },
//           (error: any) => {
//             console.log('error: ', error);
//           }
//         );
//     }})
//   );
// }

// interface FavouriteParams {
//   // id object
//   // class name model
//   objects: Array<{id, model}>;
// }
