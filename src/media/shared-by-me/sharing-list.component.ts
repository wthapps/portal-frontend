import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
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
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

@Mixin([MediaBasicListMixin, SharingModalMixin])
@Component({
  selector: 'me-sharings',
  templateUrl: '../shared/list/list.component.html'
})
export class ZMediaSharingListComponent implements OnInit, MediaBasicListMixin, SharingModalMixin {
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
  subShareSave: any;

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

  loadObjects(input?: any) {
    this.apiBaseService.get('media/sharings').subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
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
    throw new Error('should overwrite this method');
  }

  selectedObjectsChanged:(objectsChanged: any) => void;

  toggleFavorite:(items?: any) => void;

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite' :
        this.menuActions.favorite.iconClass = this.favoriteAll? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged' :
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
    }
  }

  doToolbarEvent(e: any) {
    console.log(e);

    switch (e.action) {
      case 'favorite':
        this.toggleFavorite();
        break;
    }
  }

  openModalShare() {
    if (this.subShareSave) this.subShareSave.unsubscribe();
    this.sharingModalService.open.next();
    this.apiBaseService.get(`media/sharings/recipients`, {id: this.selectedObjects[0].id}).subscribe(res => {
      this.sharingModalService.open.next({sharingRecipients: res.data});
    });
    this.subShareSave = this.sharingModalService.onSave$.take(1).subscribe(e => {
      this.apiBaseService.post('media/sharings/edit_recipients', {id: this.selectedObjects[0].id, role_id: e.role.id, recipients: e.sharingRecipients, user: e.selectedContacts}).subscribe(res => {
        console.log(res);
      })
    })
  }

  onSaveShare: (input: any) => void;

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    this.router.navigate(['shared', object.uuid], {queryParams: {returnUrl: this.router.url}});
  }

  changeViewMode:(mode: any) => void;

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
        // action: this.openModalShare.bind(this),
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
      // tag: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: false, // Outside dropdown list
      //   action: () => { },
      //   class: 'btn btn-default',
      //   liclass: 'hidden-xs',
      //   tooltip: this.tooltip.tag,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-tag'
      // },
      // tagMobile: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: true, // Inside dropdown list
      //   action: () => { },
      //   class: '',
      //   liclass: 'visible-xs-block',
      //   title: 'Tag',
      //   tooltip: this.tooltip.tag,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-tag'
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
        action: () => { },
        class: '',
        liclass: '',
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      detail: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => { },
        class: '',
        liclass: '',
        title: 'View Detail',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      download: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => { },
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
        action: () => { },
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
