import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  PhotoService,
  UserService
} from '@wth/shared/services';
import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { AlbumCreateModalComponent } from '@media/shared/modal';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { Location } from '@angular/common';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { Constants } from '@shared/constant';
import { MediaDetailMixin } from '@media/shared/mixin/media-detail.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
@Mixin([MediaDetailMixin])
@Component({
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.scss'],
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumCreateModalComponent,
    AddToAlbumModalComponent,
    PhotoEditModalComponent
  ]
})
export class PhotoDetailComponent implements OnInit, MediaDetailMixin {
  object: any;
  loading: any;
  ids: any;
  mode: any;
  showDetail: any;
  isOwner: any;
  recipients: any;

  constructor(public apiBaseService: ApiBaseService,
    public confirmService: WthConfirmService,
    public route: ActivatedRoute,
    public photoService: PhotoService,
    public location: Location) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.photoService.getPhoto(p.id).subscribe(res => {
        this.object = res.data;
      });
    })
  }
  doEvent(e: any) {
    console.log(e);
    switch (e.action) {
      case 'goBack' :
        this.back();
      default:
        break;
    }
  }

  loadObject(input?: any) {
    throw new Error('should overwrite this method');
  }

  toggleFavorite(item?: any) {
    let data = this.object;
    if (item) data = item;

    this.apiBaseService
      .post(`media/favorites/toggle`, {
        objects: data.map(v => {
          return { id: v.id, object_type: v.model };
        })
      })
      .subscribe(res => {
        this.onToggleFavorite(res.data);
      });
  }

  onToggleFavorite(input: any) {
    throw new Error('should overwrite this method');
  }

  deleteObject(term: any = 'photo') {
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete this ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
          this.back();
          this.loading = false;
        })
      }
    })
  }

  back() {
    this.location.back();
  }
}
