import {
  Component,
  ComponentFactoryResolver, OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
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
import { MediaActionHandler } from '@media/shared/media';
import { AlbumService } from '@media/shared/service';

@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html'
})
export class AlbumListComponent extends MediaActionHandler implements OnInit, OnDestroy {

  albums$: Observable<any>;
  loading$: Observable<any>;

  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;
  private type = 'album';
  private path = 'media/media';
  private sub: any;
  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private router: Router,
    private mediaUploaderDataService: MediaUploaderDataService,
    private albumService: AlbumService
  ) {
    super(resolver, store);

    this.albums$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);

    this.sub = this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }

  ngOnInit() {
    this.doEvent({action: 'getAll', payload: {path: this.path, queryParams: {type: this.type}}});
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
      case 'deleteMedia':
        this.store.dispatch(new DeleteMany({ ...event.payload }));
        break;
      case 'download':
        this.albumService.getPhotosByAlbum(event.payload.selectedObjects[0].id).subscribe(response => {
          this.store.dispatch(new Download({selectedObjects: response.data}));
        });
    }
  }

  viewDetails(payload: any) {
    this.router.navigate(['albums', payload.selectedObject.uuid]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
