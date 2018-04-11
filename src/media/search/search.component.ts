import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import * as appStore from '../shared/store';
import {
  Select,
  SelectAll,
  Deselect,
  DeselectAll,
  GetMore,
  Favorite,
  Update,
  AddSuccess,
  DeleteMany,
  Search
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { Constants } from '@wth/shared/constant';
import {
  AlbumCreateModalComponent,
} from '@media/shared/modal';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';

@Component({
  moduleId: module.id,
  selector: 'me-search',
  templateUrl: 'search.component.html',
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AddToAlbumModalComponent,
    AlbumCreateModalComponent,
    PhotoEditModalComponent
  ]
})
export class ZMediaSearchComponent extends DynamicModal implements OnInit {
  objects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;
  objectType = 'media';
  returnUrl = '';
  sub: any;
  constructor(
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService,
    private route: ActivatedRoute
  ) {
    super(resolver);

    this.objects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    this.sub = this.route.queryParams.subscribe((params: any) => {
      const query = params['q'];
      if (query) {
        this.doEvent({ action: 'search', payload: {path: 'media/search', queryParams: {q: query}}});
      }
    });
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

    switch (event.action) {
      case 'search':
        this.store.dispatch(new Search({...event.payload}));
        break;
      case 'getMore':
        this.store.dispatch(new GetMore({...event.payload}));
        break;
      case 'sort':
        this.store.dispatch(new Search({...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(new Deselect({selectedObjects: event.payload.selectedObjects}));
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
      case 'preview':
        this.preview(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'goBack':
        if (this.returnUrl === '') {
          history.back();
          return;
        }
        this.router.navigate([this.returnUrl]);
        break;
    }
  }

  preview(payload: any) {
    const objects = payload.selectedObjects;
    const ids = _.map(objects, 'id');

    this.router.navigate([{
        outlets: {
          modal: [
            'photos',
            objects[0].id,
            {ids: ids, mode: 0}
          ]
        }
      }], {queryParamsHandling: 'preserve', preserveFragment: true}
    );
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
