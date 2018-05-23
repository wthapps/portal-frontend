import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  Update,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';

@Component({
  selector: 'me-sharings',
  templateUrl: 'sharing-list.component.html'
})
export class ZMediaSharingListComponent extends MediaActionHandler implements OnInit, OnDestroy {
  sharings$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;

  tooltip: any = Constants.tooltip;

  private path = 'media/sharings';
  private sub: any;
  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService,
    private sharingService: SharingService
  ) {
    super(resolver, store);

    this.sharings$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);

    this.sub = this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
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
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: event.payload.header || 'Delete sharing',
          acceptLabel: 'Delete',
          message: event.payload.message || `Are you sure to delete ${event.payload.selectedObjects.length} sharing(s)`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'download':
        this.sharingService.get(event.payload.selectedObjects[0].id).subscribe(response => {
          this.store.dispatch(new Download({selectedObjects: response.data}));
        });
        break;
    }
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    this.router.navigate(['shared', object.uuid], {queryParams: {returnUrl: this.router.url}});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}