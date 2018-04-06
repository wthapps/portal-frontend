import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import * as appStore from '../shared/store';
import * as fromAlbum from '../shared/store/album/album.action';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';


@Component({
  moduleId: module.id,
  selector: 'me-favourites-list',
  templateUrl: 'favourites-list.component.html'
})
export class ZMediaFavoriteListComponent extends DynamicModal implements OnInit {
  favoriteObjects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;

  constructor(
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router
  ) {
    super(resolver);

    this.favoriteObjects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: 'media/favorites', queryParams: {}} });
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

    switch (event.action) {
      case 'getAll':
        this.store.dispatch(
          new fromAlbum.GetAll({ ...event.payload})
        );
        break;
      case 'getMore':
        this.store.dispatch(
          new fromAlbum.GetMore({ ...event.payload})
        );
        break;
      case 'sort':
        this.store.dispatch(new fromAlbum.GetAll({
          ...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new fromAlbum.Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new fromAlbum.SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(
          new fromAlbum.Deselect({
            selectedObjects: event.payload.selectedObjects
          })
        );
        break;
      case 'deselectAll':
        this.store.dispatch(new fromAlbum.DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new fromAlbum.AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new fromAlbum.Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new fromAlbum.Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.store.dispatch(new fromAlbum.DeleteMany({ ...event.payload }));
        break;
    }
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    if (object.object_type === 'album') {
      this.router.navigate(['albums', object.id], {queryParams: {returnUrl: this.router.url}});
    } else {
      this.router.navigate([{
          outlets: {
            ['modal']: [
              `photos`,
              object.id,
              {ids: [object.id], mode: 0}
            ]
          }
        }], {preserveQueryParams: true, preserveFragment: true}
      );
    }
  }

  // private onOneFavourite(item: any) {
  //   let findItemFavourite = _.findIndex(this.data.albums, ['id', item.id]);
  //   this.photoService
  //     .actionOneFavourite(item)
  //     .toPromise()
  //     .then((res: any) => {
  //       if (res.message === 'success') {
  //         this.data.albums[findItemFavourite].favorite = this.data.albums[
  //           findItemFavourite
  //         ].favorite
  //           ? false
  //           : true;
  //       }
  //     });
  // }
}
