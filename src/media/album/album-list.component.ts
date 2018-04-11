import {
  Component,
  ComponentFactoryResolver,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as appStore from '../shared/store';
import {
  Select,
  SelectAll,
  Deselect,
  DeselectAll,
  GetAll,
  GetMore,
  Favorite,
  Update,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import {
  AlbumCreateModalComponent,
  AlbumEditModalComponent,
  AlbumDeleteModalComponent
} from '@media/shared/modal';
import { Constants } from '@wth/shared/constant';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';

@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html',
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumCreateModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent
  ]
})
export class AlbumListComponent extends DynamicModal implements OnInit {

  albums$: Observable<any>;
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

    this.albums$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);

    this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }

  ngOnInit() {
    this.doEvent({action: 'getAll', payload: {path: 'media/media', queryParams: {type: 'album'}}});
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

    switch (event.action) {
      case 'getAll':
        this.store.dispatch(
          new GetAll({ ...event.payload})
        );
        break;
      case 'getMore':
        this.store.dispatch(
          new GetMore({ ...event.payload})
        );
        break;
      case 'sort':
        this.store.dispatch(new GetAll({
          ...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(new Deselect({selectedObjects: event.payload.selectedObjects})
        );
        break;
      case 'deselectAll':
        this.store.dispatch(new DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
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
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.store.dispatch(new DeleteMany({ ...event.payload }));
        break;
    }
  }

  viewDetails(payload: any) {
    this.router.navigate(['albums', payload.selectedObject.id]);
  }
}
