import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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

@Component({
  selector: 'me-sharings',
  templateUrl: 'sharing-list.component.html'
})
export class ZMediaSharingListComponent extends MediaActionHandler implements OnInit {
  sharings$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;

  tooltip: any = Constants.tooltip;

  private path = 'media/sharings';

  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService
  ) {
    super(resolver, store);

    this.sharings$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
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
          header: 'Delete sharing',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} sharing(s)`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'download':
        this.store.dispatch(new Download(event.payload));
        break;
    }
  }

  viewDetails(payload: any) {
    this.router.navigate(['shared-by-me', payload.selectedObject.id]);
  }
}
