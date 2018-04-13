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

import { AlbumService } from '../shared/service/album.service';
import * as appStore from '../shared/store';
import {
  GetAll,
  GetMore,
  Favorite,
  Download,
  AddSuccess,
  AddToDetailObjects,
  RemoveFromDetailObjects
} from '../shared/store/media/media.actions';

import { Constants } from '@wth/shared/constant';


import { AlbumDetailInfoComponent } from '@media/album/album-detail-info.component';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MediaActionHandler } from '@media/shared/media';
import {  } from '@media/../../shared/shared/components/photo/modal/tagging/tagging-modal.component';

@Component({
  selector: 'me-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album-detail.component.scss']
})
export class ZMediaAlbumDetailComponent extends MediaActionHandler implements OnInit, OnDestroy {
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

  private type = 'photo';
  private path = 'media/media';

  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private albumService: AlbumService,
    protected mediaSelectionService: WMediaSelectionService
  ) {
    super(resolver, store, mediaSelectionService);
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
          new GetAll({
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
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({path: this.path, detail: this.detail,
            queryParams: {
            type: this.type,
            album: this.album.id,
            ...event.payload.queryParams
          }
        }));
        break;
      case 'openUploadModal':
        // this.mediaUploaderDataService.onShowUp();
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
      case 'toggleDetailsInfo':
        this.showDetailsInfo = !this.showDetailsInfo;
        break;
      // add photos to album
      case 'addToParent':
        this.store.dispatch(new AddToDetailObjects({album: this.album, photos: event.payload.photos}));
        break;
      case 'removeFromParent':
        this.store.dispatch(new RemoveFromDetailObjects(event.payload));
        break;
      case 'download':
        this.store.dispatch(new Download(event.payload));
        break;
      case 'goBack':
        this.router.navigateByUrl(this.returnUrl);
        break;
    }
  }

  getMore(event: any) {
    this.store.dispatch(new GetMore({
      ...event.payload,
      type: 'photo',
      detail: this.detail,
      object: this.album })
    );
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
