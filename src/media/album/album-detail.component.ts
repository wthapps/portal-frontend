import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { saveAs } from 'file-saver';

import { AlbumService } from '../shared/services/album.service';
import * as fromAlbum from '../shared/store/album/album.action';
import * as appStore from '../shared/store';
import { Constants } from '@wth/shared/constant';
import { BaseObjectEditNameModalComponent } from '@shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import {
  AlbumCreateModalComponent,
  AlbumDeleteModalComponent
} from '@media/shared/modal';
import { AlbumEditModalComponent } from '@wth/shared/shared/components/photo/modal/album-edit-modal.component';
import { AlbumDetailInfoComponent } from '@media/album/album-detail-info.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/add-to-album-modal.component';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';

@Component({
  selector: 'z-media-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album-detail.component.scss'],
  entryComponents: [
    BaseObjectEditNameModalComponent,
    TaggingModalComponent,
    SharingModalComponent,
    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent,
    AlbumDetailInfoComponent,
    AddToAlbumModalComponent
  ]
})
export class ZMediaAlbumDetailComponent extends DynamicModal implements OnInit, OnDestroy {
  @ViewChild('infoContainer', { read: ViewContainerRef }) infoContainer: ViewContainerRef;

  album: any;
  params: any;
  showDetail: boolean;

  detailInfoComponent: any;
  detailInfo: any;
  showDetailsInfo: boolean;

  photos: Observable<any>;
  nextLink: Observable<any>;

  tooltip: any = Constants.tooltip;
  detail = true;
  returnUrl: string;

  constructor(
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private mediaSelectionService: WMediaSelectionService
  ) {
    super(resolver);
    this.photos = this.store.select(appStore.selectDetailObjects);
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'albums';

    this.createDetailInfoComponent();
    this.detailInfo.event
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });

    this.route.params
      .switchMap((params: Params) => {
        this.params = params;
        this.showDetail = params['showDetail'] || false;
        return this.albumService.getAlbum(params['id']);
      })
      .subscribe((res: any) => {
        this.album = res.data;
        this.store.dispatch(
          new fromAlbum.GetAll({
            detail: this.detail,
            path: 'media/media',
            queryParams: {
              type: 'photo', album: this.album.id
            }
          })
        );
        this.detailInfo.updateProperties({ object: this.album });
      });
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action);

    switch (event.action) {
      case 'loadMore':
        this.store.dispatch(new fromAlbum.GetMore({
          ...event.payload,
          type: 'photo',
          detail: this.detail,
          object: this.album }));
        break;
      case 'sort':
        this.store.dispatch(new fromAlbum.GetAll({
          ...event.payload,
          type: 'photo',
          detail: this.detail,
          object: this.album }));
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
        this.openModal(event.payload, this.mediaSelectionService);
        break;
      case 'openUploadModal':
        // this.mediaUploaderDataService.onShowUp();
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
      case 'previewAllPhotos':
        this.router.navigate(
          [
            {
              outlets: {
                modal: [
                  'photos',
                  event.payload.selectedObject.id,
                  { ids: [event.payload.selectedObject.id], mode: 0 }
                ]
              }
            }
          ],
          { queryParamsHandling: 'preserve', preserveFragment: true }
        );
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new fromAlbum.Update(event.params.selectedObject));
        break;
      case 'toggleDetailsInfo':
        this.showDetailsInfo = !this.showDetailsInfo;
        break;
      case 'addPhotoToAlbum':
        this.store.dispatch(
          new fromAlbum.AddToDetailObjects({
            album: this.album,
            photos: event.payload.photos
          })
        );
        break;
      case 'removeFromAlbum':
        this.store.dispatch(
          new fromAlbum.RemoveFromDetailObjects(event.payload)
        );
        break;
      case 'download':
        this.store.dispatch(new fromAlbum.Download(event.payload));
        break;
      case 'goBack':
        this.router.navigate([this.returnUrl]);
        break;
    }
  }

  ngOnDestroy() {}

  private createDetailInfoComponent() {
    const detailInfoComponentFactory = this.resolver.resolveComponentFactory(
      AlbumDetailInfoComponent
    );
    this.infoContainer.clear();
    this.detailInfoComponent = this.infoContainer.createComponent(
      detailInfoComponentFactory
    );
    this.detailInfo = <AlbumDetailInfoComponent>this.detailInfoComponent
      .instance;
    this.detailInfo.updateProperties({ object: this.album });
  }

  private viewDetails(payload: any) {
    this.router.navigate(
      [
        {
          outlets: {
            modal: [
              'photos',
              payload.selectedObject.id,
              { ids: [payload.selectedObject.id], mode: 0 }
            ]
          }
        }
      ],
      { queryParamsHandling: 'preserve', preserveFragment: true }
    );
  }
}
