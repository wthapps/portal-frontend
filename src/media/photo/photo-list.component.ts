import {Component, OnInit, ComponentFactoryResolver, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent extends MediaActionHandler implements OnInit, OnDestroy {
  photos$: Observable<any>;
  nextLink$: Observable<any>;
  links$: Observable<any>;
  currentQuery: string;

  loading$: Observable<any>;
  tooltip: any = Constants.tooltip;
  type = 'photo';
  path = 'media/media';
  private sub: any;
  constructor(
    public store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService
  ) {
    super(resolver, store);

    this.photos$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
    this.links$ = this.store.select(appStore.selectLinks);

    this.sub = this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
    });

    this.links$.subscribe(links => {
      if (links) {
        this.currentQuery = links.self;
      }
    });
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: this.path, queryParams: {type: this.type}}});
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({path: this.path, queryParams: {type: this.type, ...event.payload.queryParams}}));
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'preview':
        this.preview(event.payload);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new DeleteMany(event.payload));
          }});
        break;
      case 'download':
        this.store.dispatch(new Download(event.payload));
        break;
      case 'updateMediaList':
          this.doEvent({ action: 'getAll', payload: {path: this.path,
            queryParams: {type: this.type, sort: 'desc', sort_name: 'created_at'}}});
        break;
    }
  }

  preview(payload: any) {
    if (payload.selectedObjects.length > 1) {
      this.viewDetails({selectedObject: payload.selectedObjects[0]}, _.map(payload.selectedObjects, 'uuid'));
    } else if (payload.selectedObjects.length === 1) {
      this.viewDetails({selectedObject: payload.selectedObjects[0]});
    } else if (payload.selectedObjects.length === 0) {
      this.viewDetails({selectedObject: payload.selectedObject});
    }
  }
  viewDetails(payload: any, ids = []) {
    const object = payload.selectedObject;
    this.router.navigate([
      `photos`,
      object.uuid, {
        batchQuery: ids.length > 0 ? `[${ids}]` : this.currentQuery,
        mode: 0
      }
    ]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
