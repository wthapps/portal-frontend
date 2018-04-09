import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import * as appStore from '../shared/store';
import * as fromMedia from '../shared/store/album/album.action';
import { Store } from '@ngrx/store';

@Component({
  moduleId: module.id,
  selector: 'me-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZMediaSharedWithMeComponent extends DynamicModal implements OnInit {
  objects$: Observable<any>;
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

    this.objects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: 'media/favorites', queryParams: {}}});
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

    switch (event.action) {
      case 'getAll':
        this.store.dispatch(
          new fromMedia.GetAll({ ...event.payload})
        );
        break;
      case 'getMore':
        this.store.dispatch(
          new fromMedia.GetMore({ ...event.payload})
        );
        break;
      case 'sort':
        this.store.dispatch(new fromMedia.GetAll({
          ...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new fromMedia.Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new fromMedia.SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(
          new fromMedia.Deselect({
            selectedObjects: event.payload.selectedObjects
          })
        );
        break;
      case 'deselectAll':
        this.store.dispatch(new fromMedia.DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new fromMedia.AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new fromMedia.Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new fromMedia.Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.store.dispatch(new fromMedia.DeleteMany({ ...event.payload }));
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
        }], {queryParamsHandling: 'preserve', preserveFragment: true}
      );
    }
  }
}
