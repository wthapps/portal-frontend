import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PhotoService, UserService } from '@wth/shared/services';
import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import {
  MediaRenameModalComponent,
  SharingModalComponent,
  TaggingModalComponent,
  AddToAlbumModalComponent,
  AlbumCreateModalComponent
} from '@media/shared/modal';
import { PhotoEditModalComponent } from '@media/shared/modal/photo/photo-edit-modal.component';
import { SharingService } from '@media/shared/modal/sharing/sharing.service';

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
export class PhotoDetailComponent extends BasePhotoDetailComponent {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected wthConfirmService: WthConfirmService,
    protected loadingService: LoadingService,
    protected photoService: PhotoService,
    protected userService: UserService,
    protected sharingService: SharingService
  ) {
    super(
      route,
      router,
      wthConfirmService,
      loadingService,
      photoService,
      userService,
      sharingService
    );
    console.log(this.isOwner);
    console.log(this.isOwner);
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
      default:
        super.doEvent(event);
        break;
    }
  }
}
