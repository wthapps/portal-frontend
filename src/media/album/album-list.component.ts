import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router, Resolve } from '@angular/router';

import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { AlbumCreateMixin } from '@shared/mixin/album/album-create.mixin';

declare var _: any;

@Mixins([MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin])
@Component({
  moduleId: module.id,
  templateUrl: '../shared/list/list.component.html'
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
  tooltip: any = Constants.tooltip;

  // check has selected objects
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  favoriteAll: boolean = false;
  links: any;
  subOpenShare: any;
  loading: boolean;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  menuActions: any = {};
  modalIns: any;
  modalRef: any;
  iconNoData: any = 'fa fa-file-video-o';
  titleNoData: any = 'There is no album!';
  subTitleNoData: any = 'Try to create a album';
  actionNoData: any = 'Create Album';
  sorting: any;
  endLoading: any;
  subCreateAlbum: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    public apiBaseService: ApiBaseService,
    public router: Router,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public objectListService: WObjectListService,
    public locationCustomService: LocationCustomService,
    public mediaCreateModalService: MediaCreateModalService,
    public resolver: ComponentFactoryResolver
  ) {
  }

  downloadMedia: (media: any) => void;

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
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

  openCreateAlbumModal:(selectedObjects: any) => void;

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, { name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id) }).subscribe(res => {
      this.loadObjects();
    })
  }

  getMenuActions() {
    return {
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.openModalShare([this.selectedObjects[0].sharing_object]);
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
        action: this.openModalShare.bind(this),
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
          this.deleteObjects('albums')
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
          })
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
          this.deleteObjects('albums')
        },
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }
  doListEvent(event: any) {
    switch (event.action) {
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject.uuid)
        break;
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'openModal':
        if (event.payload.modalName == "editNameModal") {
          this.openEditModal(event.payload.selectedObject)
        };
        if (event.payload.modalName == "createAlbumModal") {
          this.openCreateAlbumModal([]);
        };
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
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

  openModalShare: (input?: any) => void;
  onSaveShare: (e: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged:(objectsChanged?: any) => void;

  toggleFavorite:(items?: any) => void;

  deleteObjects: (term: any) => void;
  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get(`media/albums`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }
  viewDetail(uuid: string) {
    this.locationCustomService.links.push('/albums');
    this.router.navigate([`/albums/${uuid}`]);
  }

  loadingEnd: () => void;

  loadMoreObjects: (input?: any) => void;

  changeViewMode: (mode: any) => void;

  loadModalComponent: (component: any) => void;
  openEditModal: (object: any) => void;
  onAfterEditModal() {
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/albums/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) sub.unsubscribe();
      })
    });
  }
}
