import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { mediaConstants } from '@media/shared/config/constants';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharingModalMixin } from '@shared/modules/photo/components/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/modules/photo/components/modal/sharing/sharing-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { MediaBasicListMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin } from '@shared/modules/photo/mixins';
import { SharingModalResult, SharingEditParams } from '@shared/modules/photo/components/modal/sharing/sharing-modal';
import Album from '@shared/modules/photo/models/album.model';
import MediaList from '@shared/modules/photo/models/list-functions/media-list.model';
import Sharing from '@shared/modules/photo/models/sharing.model';

declare var _: any;

@Mixins([MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin])
@Component({
  templateUrl: '../shared/list/list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit,
  MediaBasicListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  AlbumCreateMixin,
  MediaModalMixin {
  // display objects on screen
  objects: Array<Album> = [];
  // tooltip to introduction
  readonly tooltip: any = Constants.tooltip;

  // check has selected objects
  hasSelectedObjects = false;
  selectedObjects: Array<Album> = [];
  favoriteAll = false;
  links: any;
  subOpenShare: any;
  loading: boolean;
  readonly viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  menuActions: any = {};
  modalIns: any;
  modalRef: any;
  readonly iconNoData: any = 'wthico-album gray';
  readonly titleNoData: any = 'There are no albums!';
  readonly subTitleNoData: any = 'User "New" button to create new albums.';
  sorting: any;
  endLoading: any;
  subCreateAlbum: any;
  disableMoreAction: boolean;
  title: string = 'Albums';
  filters: any = [];
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  openCreateAlbumModal: (selectedObjects: any) => void;
  // openModalShare: (input?: any) => void;
  // onSaveShare: (e: any) => void;
  // selectedObjectsChanged: (objectsChanged?: any) => void;

  toggleFavorite: (items?: any) => void;

  deleteObjects: (term: any) => void;
  loadingEnd: () => void;
  deSelect: () => void;

  loadMoreObjects: (input?: any) => void;

  changeViewMode: (mode: any) => void;

  loadModalComponent: (component: any) => void;
  openEditModal: (object: any) => void;

  onDoneAlbum: (e: any) => void;

  downloadMedia: (media: any) => void;

  constructor(
    public apiBaseService: ApiBaseService,
    public router: Router,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public objectListService: WObjectListService,
    public localStorageService: LocalStorageService,
    public mediaCreateModalService: MediaCreateModalService,
    public commonEventService: CommonEventService,
    public resolver: ComponentFactoryResolver
  ) {
  }


  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
  }

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (this.selectedObjects.length > 1) {
          this.menuActions.edit.active = false;
          this.menuActions.preview.active = false;
          this.menuActions.share.active = false;
          this.menuActions.shareMobile.active = false;
          this.menuActions.download.active = false;
        } else {
          this.menuActions.edit.active = true;
          this.menuActions.preview.active = true;
          this.menuActions.share.active = true;
          this.menuActions.shareMobile.active = true;
          this.menuActions.download.active = true;
        }
        this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        this.disableMoreAction = (Object.keys(this.menuActions)
          .filter(el => (this.menuActions[el].inDropDown && this.menuActions[el].active && !this.menuActions[el].mobile)).length === 0);
        break;
      default:
        break;
    }
  }

  shareSelectedObject() {
    this.openModalShare(this.selectedObjects);
  }

  selectedObjectsChanged(objectsChanged: any = this.objects) {
    if (this.objects) {
      this.selectedObjects = MediaList.map(this.objects.filter(v => v.selected == true));
      this.hasSelectedObjects = this.selectedObjects.length > 0;
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      this.commonEventService.broadcast({
        channel: 'ZMediaSharedLeftMenuComponent',
        action: 'updateSelectedObjects',
        payload: this.selectedObjects
      })
      this.onListChanges({ action: 'selectedObjectsChanged', payload: objectsChanged });
    }
  }

  openModalShare: (data) => void;

  onSaveShare(sharing: Sharing) {
    if (MediaList.isSingleAlbum(this.selectedObjects)) {
      this.selectedObjects[0].sharing_id = sharing.id;
      this.selectedObjects[0].recipients_count = sharing.recipients_count;
      this.objects = this.objects.map(e => {
        if (e.id == this.selectedObjects[0].id) {
          e.sharing_id = this.selectedObjects[0].sharing_id;
          e.recipients_count = this.selectedObjects[0].recipients_count;
        }
        return e;
      });
    }
    this.toastsService.success("success");
  }

  getMenuActions() {
    return {
      preview: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.viewDetail(this.selectedObjects[0].uuid);
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
        action: () => {
          this.shareSelectedObject();
        },
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
        action: () => {
          this.shareSelectedObject();
        },
        class: '',
        mobile: true,
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavorite.bind(this),
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      delete: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.deleteObjects('albums');
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        title: 'Delete',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openEditModal(this.selectedObjects[0]);
        },
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
        action: () => {
          this.apiBaseService.get(`media/media/${this.selectedObjects[0].uuid}/objects`, { model: 'Media::Album' }).subscribe(res => {
            this.downloadMedia(res.data);
          });
        },
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
        action: () => {
          this.deleteObjects('albums');
        },
        class: '',
        mobile: true,
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    };
  }
  doListEvent(event: any) {
    switch (event.action) {
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject.uuid);
        break;
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'openModal': {
        if (event.payload.modalName === 'editNameModal') {
          this.openEditModal(event.payload.selectedObject);
        }
        if (event.payload.modalName === 'createAlbumModal') {
          this.openCreateAlbumModal([]);
        }
        break;
      }
      case 'sort': {
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
      }
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
    }
  }

  doEvent(event) {
    const { action } = event;
    switch (action) {
      case 'noData': {
        this.openCreateAlbumModal([]);
      }
        break;
    }
  }


  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || 'Date', sort: opts.sort || 'desc' };
    this.objects = [];
    this.apiBaseService.get(`media/albums`, opts).subscribe(res => {
      this.objects = MediaList.map(res.data);
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  viewDetail(uuid: string) {
    this.router.navigate([`/albums/${uuid}`], { queryParams: { returnUrls: ['/', '/albums'] } });
  }

  onAfterEditModal() {
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/albums/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) { sub.unsubscribe(); }
      });

    });
  }
}
