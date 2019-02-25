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
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { AlbumCreateMixin } from '@shared/mixin/album/album-create.mixin';
import { mediaConstants } from '@media/shared/config/constants';
import { LocalStorageService } from 'angular-2-local-storage';

declare var _: any;

@Mixins([MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin])
@Component({
  templateUrl: '../shared/list/list.component.html',
  styleUrls: [ './album-list.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class AlbumListComponent implements OnInit,
  MediaBasicListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  AlbumCreateMixin,
  MediaModalMixin {
  // display objects on screen
  objects: any;
  // tooltip to introduction
  readonly tooltip: any = Constants.tooltip;

  // check has selected objects
  hasSelectedObjects = false;
  selectedObjects: any = [];
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
  readonly subTitleNoData: any = 'Try to create an album';
  readonly actionNoData: any = 'Create Album';
  sorting: any;
  endLoading: any;
  subCreateAlbum: any;
  title: string = 'Albums';
  filters: any = [];
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  openCreateAlbumModal: (selectedObjects: any) => void;
  openModalShare: (input?: any) => void;
  onSaveShare: (e: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  selectedObjectsChanged: (objectsChanged?: any) => void;

  toggleFavorite: (items?: any) => void;

  deleteObjects: (term: any) => void;
  loadingEnd: () => void;
  deSelect: () => void;

  loadMoreObjects: (input?: any) => void;

  changeViewMode: (mode: any) => void;

  loadModalComponent: (component: any) => void;
  openEditModal: (object: any) => void;

  onDoneAlbum: (e: any) => void;

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

  downloadMedia: (media: any) => void;

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
        } else {
          this.menuActions.edit.active = true;
        }
        this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  shareSelectedObject() {
    this.openModalShare([this.selectedObjects[0].sharing_object]);
    const sub = this.sharingModalService.update$.subscribe(res => {
      if (!this.selectedObjects[0].sharing_object) {
        this.selectedObjects[0].sharing_object = res.sharing_object;
      }
      sub.unsubscribe();
    })
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
    const {action} = event;
    console.log('doEvent action: ', action);
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
    this.apiBaseService.get(`media/albums`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  viewDetail(uuid: string) {
    this.router.navigate([`/albums/${uuid}`], {queryParams: {returnUrls: ['/', '/albums']}});
  }

  onAfterEditModal() {
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/albums/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) { sub.unsubscribe(); }
      });

    });
  }
}
