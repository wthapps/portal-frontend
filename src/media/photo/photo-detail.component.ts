import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {ApiBaseService, PhotoService, UserService} from '@wth/shared/services';
import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import {
  AlbumCreateModalComponent
} from '@media/shared/modal';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';

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
    PhotoEditModalComponent]
})
export class PhotoDetailComponent extends BasePhotoDetailComponent implements OnInit {
  returnUrl: string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected wthConfirmService: WthConfirmService,
    protected loadingService: LoadingService,
    protected photoService: PhotoService,
    protected userService: UserService,
    protected sharingService: SharingService,
    protected api: ApiBaseService
  ) {
    super(
      route,
      router,
      wthConfirmService,
      loadingService,
      photoService,
      userService,
      sharingService,
      api
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'photos';
  }

  doEvent(event: any) {
    switch (event.action) {
      // Handle all of event in child class here
      case 'media:photo:load_sharing_info':
        this.sharingService
          .getShared({ objects: [this.id] })
          .toPromise()
          .then((response: any) => {
            this.recipients = response.data;
            this.photo.json_shares = response.data;
          });
        break;
      case 'media:photo:update_recipients':
        this.photo.json_shares = event.payload.data;
        break;
      case 'editInfo':
        this.loadingService.start();
          const selectedObject = event.params.selectedObject;
          const updated_at = new Date(selectedObject.created_at);
          const body = JSON.stringify({
            name: selectedObject.name,
            created_day: updated_at.getDate(),
            created_month: updated_at.getMonth() + 1,
            created_year: updated_at.getUTCFullYear(),
            description: selectedObject.description
          });
        this.photoService.updateInfo(selectedObject.id, body)
          .toPromise().then(
          (res: any) => {
            this.loadingService.stop();
          },
          (error: any) => {
            this.loadingService.stop();
          }
        );
        break;
      case 'goBack':
        this.router.navigateByUrl(this.returnUrl);
        break;
      default:
        super.doEvent(event);
        break;
    }
  }
}
