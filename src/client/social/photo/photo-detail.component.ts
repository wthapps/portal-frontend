import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../core/shared/services/photo.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';
import { ConfirmationService } from 'primeng/primeng';
import { LoadingService } from '../../core/shared/components/loading/loading.service';

@Component({
  moduleId: module.id,
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css'],
  entryComponents: []
})

export class PhotoDetailComponent extends BasePhotoDetailComponent {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected loadingService: LoadingService,
    protected photoService: PhotoService,
  ) {
    super(route, router, confirmationService, loadingService, photoService);
  }

}
