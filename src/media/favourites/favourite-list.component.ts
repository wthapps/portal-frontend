import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { MediaActionHandler } from '@media/shared/media';
import { DeleteManySuccess } from '@media/shared/store/media';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Component({
  moduleId: module.id,
  selector: 'me-favourite-list',
  templateUrl: 'favourite-list.component.html'
})
export class ZMediaFavoriteListComponent extends MediaActionHandler implements OnInit, OnDestroy {
  favoriteObjects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  links$: Observable<any>;
  tooltip: any = Constants.tooltip;

  private path = 'media/favorites';
  private sub: any;
  private currentQuery: string;

  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService
  ) {
    super(resolver, store);

    this.favoriteObjects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
    this.links$ = this.store.select(appStore.selectLinks);

    this.sub = this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });

    this.sub = this.links$.subscribe(links => {
      if (links) {
        this.currentQuery = links.self;
      }
    });
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: this.path, queryParams: {}} });
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({path: this.path, queryParams: {...event.payload.queryParams}}));
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new Favorite(event.payload));
        this.store.dispatch(new DeleteManySuccess(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete confirmation',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} item(s)`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
    }
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    if (object.object_type === 'album') {
      this.router.navigate(['albums', object.uuid], {queryParams: {returnUrl: this.router.url}});
    } else if (object.object_type === 'sharing') {
      this.router.navigate(['shared', object.uuid], {queryParams: {returnUrl: this.router.url}});
    } else {
      this.router.navigate([
        `photos`,
        object.uuid, {
          batchQuery: this.currentQuery.split('?').length > 1 ? `${this.currentQuery}&type=photo` :
            `${this.currentQuery}?type=photo`,
          mode: 0
        }
      ], {queryParams: {returnUrl: this.router.url}});
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
