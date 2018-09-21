import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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
import { ApiBaseService } from '@shared/services';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';

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
  iconNoData: any = 'fa fa-share-alt';
  titleNoData: any = 'There no media shared by you!';
  subTitleNoData: any = 'Media can be shared to your connected contact.';
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    public resolver: ComponentFactoryResolver,
    public mediaUploaderDataService: MediaUploaderDataService,
    public sharingModalService: SharingModalService,
    public apiBaseService: ApiBaseService,
    public router: Router,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public sharingService: SharingService
  ) {
  }

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get('media/sharings', opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    })
  }

  loadMoreObjects(input?: any) {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
      })
    }
  }

  viewDetail(input?: any) {
    /* this method is load detail object */
    this.router.navigate(['/shared', input]);
  }

  selectedObjectsChanged:(objectsChanged: any) => void;

  toggleFavorite:(items?: any) => void;

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite' :
        this.menuActions.favorite.iconClass = this.favoriteAll? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged' :
        if(this.selectedObjects && this.selectedObjects.length > 1) {
          this.menuActions.share.active = false;
          this.menuActions.shareMobile.active = false;
        } else {
          this.menuActions.share.active = true;
          this.menuActions.shareMobile.active = true;
        }
        this.menuActions.favorite.iconClass = this.favoriteAll? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  deleteObjects:(term: any) => void;

  doListEvent(e: any) {
    switch (e.action) {
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'viewDetails':
        this.viewDetail(e.payload.selectedObject.uuid);
        break;
      case 'openModal':
        this.openEditModal(e.payload.selectedObject)
        this.modalIns.event.subscribe(e => this.doModalAction(e));
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
    }
  }

  doModalAction(e: any) {
    switch (e.action) {
      case 'editName' :
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
  downloadMedia:(media) => void;

  openModalShare:(array?: any) => void;

  onSaveShare:(input: any) => void;
  onEditShare:(input: any, sharing: any) => void;

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    this.router.navigate(['shared', object.uuid]);
  }

  changeViewMode:(mode: any) => void;

  loadModalComponent: (component: any) => void;

  openEditModal:(object: any) => void;
  onAfterEditModal() {

  };

  openEditModalCustom() {
    if(this.selectedObjects && this.selectedObjects.length == 1) {
      this.openEditModal(this.selectedObjects[0]);
      this.modalIns.event.subscribe(e => this.doModalAction(e));
    }
  };

  getMenuActions() {
    return {
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.openModalShare.bind(this),
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
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }
}
