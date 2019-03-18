import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { mediaConstants } from '@media/shared/config/constants';
import { LocalStorageService } from 'angular-2-local-storage';

@Mixins([MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin])
@Component({
  selector: 'me-sharings',
  templateUrl: '../shared/list/list.component.html'
})
export class ZMediaSharingListComponent implements OnInit, MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin {
  objects: any;
  links: any;
  hasSelectedObjects: boolean;
  selectedObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  menuActions: any = {};
  modalIns: any;
  modalRef: any;
  sorting: any;
  endLoading: any;
  iconNoData: any = 'fa fa-share-alt';
  titleNoData: any = 'You have not shared albums with anyone.';
  subTitleNoData: any = 'You can share albums with your WTH!Apps contacts.';
  title: string = 'Shared by me';
  disableMoreAction: boolean;
  filters: any = [];
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    public resolver: ComponentFactoryResolver,
    public mediaUploaderDataService: MediaUploaderDataService,
    public sharingModalService: SharingModalService,
    public apiBaseService: ApiBaseService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public toastsService: ToastsService,
    public commonEventService: CommonEventService,
    public confirmService: WthConfirmService,
    public sharingService: SharingService
  ) {
  }
  deSelect: () => void;

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get('media/sharings', opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    })
  }

  loadMoreObjects: (input?: any) => void;

  viewDetail(object?: any) {
    /* this method is load detail object */
    // this.router.navigate(['/shared', input]);
    if (object.model == 'Media::Album') {
      this.router.navigate(['/albums', object.uuid], { queryParams: { returnUrls: ["shared-by-me"] } });
    } else {
      this.router.navigate(['/shared', object.uuid], { queryParams: { returnUrls: ["shared-by-me"] } });
    }
  }

  selectedObjectsChanged: (objectsChanged?: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(event => {
      switch (event.action) {
        case 'editInfo':
          if (event.params.selectedObject.model == 'Media::Album') {
            this.apiBaseService.put(`media/albums/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {

            });
          } else {
            this.apiBaseService.put(`media/sharings/${event.params.selectedObject.id}`,
              {
                name: event.params.selectedObject.name,
                description: event.params.selectedObject.description
              })
              .subscribe(res => {
                // this.object = res.data;
              });
          }
      }
    });
  };

  toggleFavorite: (items?: any) => void;

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (this.selectedObjects && this.selectedObjects.length > 1) {
          this.menuActions.share.active = false;
          this.menuActions.shareMobile.active = false;
          this.menuActions.preview.active = false;
          this.menuActions.edit.active = false;
          this.menuActions.download.active = false;
        } else {
          this.menuActions.share.active = true;
          this.menuActions.shareMobile.active = true;
          this.menuActions.preview.active = true;
          this.menuActions.edit.active = true;
          this.menuActions.download.active = true;
        }
        this.disableMoreAction = (Object.keys(this.menuActions)
          .filter(el => (this.menuActions[el].inDropDown && this.menuActions[el].active && !this.menuActions[el].mobile)).length === 0);
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  deleteObjects: (term: any) => void;

  doListEvent(e: any) {
    switch (e.action) {
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'viewDetails':
        this.viewDetail(e.payload.selectedObject);
        break;
      case 'openModal':
        this.openEditModal(e.payload.selectedObject)
        this.modalIns.event.subscribe(e => this.doModalAction(e));
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
        break;
    }
  }

  doModalAction(e: any) {
    switch (e.action) {
      case 'editName':
        this.apiBaseService.put(`media/sharings/${e.params.selectedObject.id}`, e.params.selectedObject).subscribe(res => {
          this.toastsService.success('Updated successfully')
        })
      default:
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
      case 'favorite':
        this.toggleFavorite();
        break;
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
    }
  }

  downloadMediaCustom() {
    this.apiBaseService.get(`media/sharings/${this.selectedObjects[0].uuid}/objects`).subscribe(res => {
      this.downloadMedia(res.data);
    });
  }
  downloadMedia: (media) => void;

  openModalShare: (array?: any) => void;

  onSaveShare: (input: any) => void;
  onEditShare: (input: any, sharing: any) => void;

  viewDetails(payload: any) {
    // const object = payload.selectedObject;
    // if (object.model == 'Media::Album'){
    //   this.router.navigate(['albums', object.uuid]);
    // } else {
    //   this.router.navigate(['shared', object.uuid]);
    // }
  }

  changeViewMode: (mode: any) => void;

  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;

  loadingEnd: () => void;

  openEditModalCustom() {
    if (this.selectedObjects && this.selectedObjects.length == 1) {
      this.openEditModal(this.selectedObjects[0]);
      this.modalIns.event.subscribe(e => this.doModalAction(e));
    }
  };

  shareSelectedObject() {
    if (this.selectedObjects[0].model == "Media::Album") {
      this.openModalShare([this.selectedObjects[0].sharing_object]);
      const sub = this.sharingModalService.update$.subscribe(res => {
        if (!this.selectedObjects[0].sharing_object) {
          this.selectedObjects[0].sharing_object = res.sharing_object;
        }
        sub.unsubscribe();
      })
    } else {
      this.openModalShare();
    }
  }

  getMenuActions() {
    return {
      preview: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.viewDetail(this.selectedObjects[0]);
        },
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.preview,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-eye'
      },
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.shareSelectedObject.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      shareMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        mobile: true,
        action: this.shareSelectedObject.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      // favorite: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: false, // Outside dropdown list
      //   action: this.toggleFavorite.bind(this),
      //   class: 'btn btn-default',
      //   liclass: '',
      //   tooltip: this.tooltip.addToFavorites,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-star'
      // },
      delete: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.deleteObjects.bind(this, 'sharings'),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: this.openEditModalCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      download: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: this.downloadMediaCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      deleteMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        action: this.deleteObjects.bind(this, 'sharings'),
        class: '',
        mobile: true,
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }
}
