import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../core/shared/services/photo.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';
import { ConfirmationService } from 'primeng/primeng';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { ZMediaSharingService } from '../../core/shared/components/photo/modal/sharing/sharing.service';

@Component({
  moduleId: module.id,
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css'],
  entryComponents: [
  ]
})

export class PhotoDetailComponent extends BasePhotoDetailComponent {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected loadingService: LoadingService,
    protected photoService: PhotoService,
    protected sharingService: ZMediaSharingService
  ) {
    super(route, router, confirmationService, loadingService, photoService, sharingService);
  }

  doEvent(event: any) {
    switch(event.action) {
      // Handle all of event in child class here
      case 'media:photo:load_sharing_info':
        this.sharingService.getShared({objects: [this.id]}).subscribe((response: any) => {
          this.recipients = response.data;
          this.photo.json_shares = response.data;
        });
        break;
      case 'media:photo:update_recipients':
        console.log('updating recipients::::');
        this.photo.json_shares = event.payload.data;
          break;
      default:
        super.doEvent(event);
        break;
    }
  }
}
