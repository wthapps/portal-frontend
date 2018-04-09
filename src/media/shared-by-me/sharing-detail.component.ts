import { Component, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ApiBaseService, CommonEventService } from '@shared/services';
import * as fromAlbum from '../shared/store/album/album.action';
import * as appStore from '../shared/store';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { Store } from '@ngrx/store';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { BaseObjectEditNameModalComponent } from '@wth/shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/add-to-album-modal.component';

@Component({
  moduleId: module.id,
  selector: 'me-sharing-detail',
  templateUrl: 'sharing-detail.component.html',
  entryComponents: [
    BaseObjectEditNameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AddToAlbumModalComponent
  ]
})
export class ZMediaSharingDetailComponent extends DynamicModal implements OnInit, OnDestroy {
  object: any;
  sub: any;
  sharing: any;
  params: any;
  showDetail: boolean;

  showDetailsInfo: boolean;

  photos: Observable<any>;
  nextLink: Observable<any>;

  tooltip: any = Constants.tooltip;
  detail = true;
  returnUrl: string;

  constructor(
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private mediaSelectionService: WMediaSelectionService,
    private confirmService: WthConfirmService
  ) {
    super(resolver);
    this.photos = this.store.select(appStore.selectDetailObjects);
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
        this.sharing = response.sharing;
        this.params = response;

        // get photos by sharing
        this.store.dispatch(
          new fromAlbum.GetAll({
            detail: this.detail,
            path: 'media/media',
            queryParams: {
              type: 'photo', sharing: this.sharing.id
            }
          })
        );
      });

    });

    //
    // this.createDetailInfoComponent();
    // this.detailInfo.event
    //   .takeUntil(this.destroySubject)
    //   .subscribe((event: any) => {
    //     this.doEvent(event);
    //   });
    //
    // this.route.params
    //   .switchMap((params: Params) => {
    //     this.params = params;
    //     this.showDetail = params['showDetail'] || false;
    //     return this.albumService.getAlbum(params['id']);
    //   })
    //   .subscribe((res: any) => {
    //     this.album = res.data;
    //     this.store.dispatch(
    //       new fromAlbum.GetAll({
    //         detail: this.detail,
    //         path: 'media/media',
    //         queryParams: {
    //           type: 'photo', album: this.album.id
    //         }
    //       })
    //     );
    //     this.detailInfo.updateProperties({ object: this.album });
    //   });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action);

    switch (event.action) {
      case 'loadMore':
        this.store.dispatch(new fromAlbum.GetMore({
          ...event.payload,
          type: 'photo',
          detail: this.detail,
          object: this.sharing }));
        break;
      case 'sort':
        this.store.dispatch(new fromAlbum.GetAll({
          ...event.payload,
          type: 'photo',
          detail: this.detail,
          object: this.sharing }));
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
      case 'preview':
        this.preview(event.payload);
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
            parent: this.sharing,
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
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete sharing',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} sharing`,
          accept: () => {
            this.store.dispatch(new fromAlbum.DeleteMany({...event.payload}));
          }});
        break;
      case 'goBack':
        this.router.navigate([this.returnUrl]);
        break;
    }
  }

  // private createDetailInfoComponent() {
  //   const detailInfoComponentFactory = this.resolver.resolveComponentFactory(
  //     AlbumDetailInfoComponent
  //   );
  //   this.infoContainer.clear();
  //   this.detailInfoComponent = this.infoContainer.createComponent(
  //     detailInfoComponentFactory
  //   );
  //   this.detailInfo = <AlbumDetailInfoComponent>this.detailInfoComponent
  //     .instance;
  //   this.detailInfo.updateProperties({ object: this.album });
  // }

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
