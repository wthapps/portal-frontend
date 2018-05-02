import { Component, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ApiBaseService, CommonEventService, PhotoUploadService } from '@shared/services';
import {
  GetAll,
  GetMore,
  Favorite,
  AddSuccess,
  AddToDetailObjects,
  RemoveFromDetailObjects,
  Download,
  DeleteMany
} from '../shared/store/media/media.actions';
import * as appStore from '../shared/store';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { Store } from '@ngrx/store';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';

@Component({
  moduleId: module.id,
  selector: 'me-sharing-detail',
  templateUrl: 'sharing-detail.component.html'
})
export class ZMediaSharingDetailComponent extends MediaActionHandler implements OnInit, OnDestroy {
  object: any;
  sub: any;
  sharing: any;
  params: any;
  showDetail: boolean;

  showDetailsInfo: boolean;

  photos$: Observable<any>;
  nextLink: Observable<any>;
  loading$: Observable<any>;

  tooltip: any = Constants.tooltip;
  detail = true;
  returnUrl: string;
  photos: Array<any>;
  role: any = {name: 'view'};
  capabilities: any = {
    canView: false,
    canFave: false,
    canDownload: false,
    canShare: false,
    canTag: false,
    canEdit: false,
    canDelete: false
  };
  private path = 'media/media';
  private type = 'photo';

  constructor(
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    protected mediaSelectionService: WMediaSelectionService,
    private confirmService: WthConfirmService,
    private photoUploadService: PhotoUploadService
  ) {
    super(resolver, store, mediaSelectionService);
    this.photos$ = this.store.select(appStore.selectDetailObjects);
    this.loading$ = this.store.select(appStore.selectLoading);

  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'shared-by-me';

    this.commonEventService
      .filter((e: any) => {
        return e.channel === 'media:photo:update_recipients';
      })
      .subscribe((e: any) => {
        this.params.recipients = e.payload;
      });
    this.route.params.subscribe((params: any) => {
      this.apiBaseService.get(`media/sharings/${params.id}`).subscribe((response: any) => {
        this.sharing = response.data;
        this.capabilities = this.sharing.capabilities;
        this.role = this.sharing.role;
      });

      this.apiBaseService.get(`media/sharings/${params.id}/full_details`).subscribe((response: any) => {
        this.sharing = response.sharing;
        this.photos = response.data;
        this.params = response;

        // get photos by sharing
        this.doEvent({
          action: 'getAll',
          payload: {detail: this.detail, path: this.path, queryParams: {type: this.type, sharing: this.sharing.id}}
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({detail: this.detail, path: this.path,
          queryParams: {...event.payload.queryParams, type: this.type, sharing: this.sharing.id}}));
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
      case 'preview':
        this.preview(event.payload);
        break;
      case 'toggleDetailsInfo':
        this.showDetailsInfo = !this.showDetailsInfo;
        break;
      // add photos to current sharing
      case 'addToParent':
        if (event.payload.uploading) {
          this.photoUploadService.uploadPhotos(event.payload.photos).subscribe((response: any) => {
            this.store.dispatch(new AddToDetailObjects({sharing: this.sharing, objects: [response.data]}));
          }, (err: any) => {
            console.error('Error when uploading files ', err);
          });
        } else {
          this.store.dispatch(new AddToDetailObjects({sharing: this.sharing, objects: event.payload.photos}));
        }
        break;
      case 'removeFromParent':
        this.store.dispatch(new RemoveFromDetailObjects(event.payload));
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete sharing',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} sharing`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'goBack':
        this.router.navigate([this.returnUrl]);
        break;
      case 'download':
        // download sharing
        if (event.payload.selectedObjects[0].object_type === 'sharing') {
          this.store.dispatch(new Download({selectedObjects: this.photos}));
        } else {
          this.store.dispatch(new Download(event.payload));
        }
        break;
    }
  }

  getMore(event: any) {
    this.store.dispatch(new GetMore({...event.payload, type: 'photo', detail: this.detail, object: this.sharing }));
  }

  private preview(payload: any) {
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

  private viewDetails(payload: any) {
    const object = payload.selectedObject;
    this.router.navigate([`photos`,
      object.id, {ids: [object.id], mode: 0}], {queryParams: {returnUrl: this.router.url}});
  }
}
