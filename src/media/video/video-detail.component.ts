import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService, WthConfirmService,
} from '@wth/shared/services';
import { Location } from '@angular/common';
import { Constants } from '@shared/constant';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';

@Mixin([SharingModalMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  selector: 'video-detail',
  templateUrl: '../shared/list/item-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class ZVideoDetailComponent implements OnInit, MediaAdditionalListMixin, SharingModalMixin, MediaDownloadMixin, MediaModalMixin {
  object: any;
  tooltip: any = Constants.tooltip;
  menuActions: any = {};
  subShareSave: any;
  selectedObjects: any;
  showDetailsInfo: any = false;
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public apiBaseService: ApiBaseService,
    public route: ActivatedRoute,
    public resolver: ComponentFactoryResolver,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public location: Location){}

  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.route.params.subscribe(params => {
      this.apiBaseService.get(`media/videos/${params.id}`).subscribe(res => {
        this.object = res.data;
        if(this.object.favorite){
          this.menuActions.favorite.iconClass = 'fa fa-star';
        } else {
          this.menuActions.favorite.iconClass = 'fa fa-star-o';
        }
      })
    })
  }

  openModalShareCustom() {
    this.openModalShare([this.object]);
  }
  openModalShare: (input: any) => void;
  onSaveShare(input: any) {
    const data: any = {
      objects: [this.object].map(s => { return { id: s.id, model: s.model } }),
      recipients: input.users,
      role_id: input.role.id
    };

    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.sharingModalService.update.next(res.data);
    });
  }
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  downloadMedia: (media: any) => void;
  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      switch (e.action) {
        case 'editInfo' :
          this.apiBaseService.put(`media/videos/${this.object.id}`, { name: e.params.selectedObject.name}).subscribe(res => {
            this.object = res.data
          })
        default:
          break;
      }
    })
  }

  getMenuActions() {
    return {
      active_drop: true,
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.openModalShareCustom.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.apiBaseService.post(`media/favorites/toggle`, {
            objects: [this.object]
              .map(v => { return { id: v.id, object_type: v.model } })
          }).subscribe(res => {
            this.object = res.data[0];
            if (this.object.favorite) {
              this.menuActions.favorite.iconClass = 'fa fa-star';
            } else {
              this.menuActions.favorite.iconClass = 'fa fa-star-o';
            }
          });
        },
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
          this.confirmService.confirm({
            header: 'Delete',
            acceptLabel: 'Delete',
            message: `Are you sure to delete this video`,
            accept: () => {
              this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
                this.back();
              });
            }
          });
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      info: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.showDetailsInfo = !this.showDetailsInfo;
        },
        class: '',
        liclass: '',
        title: 'View Information',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      download: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.downloadMedia([this.object]);
        },
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openEditModal(this.object);
        },
        class: '',
        liclass: '',
        title: 'Edit Info',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      }
    }
  }

  back() {
    this.location.back();
  }
}
