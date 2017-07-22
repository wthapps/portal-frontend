import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute, Route, Router, UrlTree } from '@angular/router';
import { PhotoService } from '../../core/shared/services/photo.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';
import { ConfirmationService } from 'primeng/primeng';
import { LoadingService } from "../../core/partials/loading/loading.service";

@Component({
  moduleId: module.id,
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css'],
  entryComponents: [
  ]
})

export class PhotoDetailComponent extends BasePhotoDetailComponent {

  constructor(protected route: ActivatedRoute, protected router: Router, protected photoService: PhotoService,
              protected confirmationService: ConfirmationService,
              protected loadingService: LoadingService) {
    super(route, router, photoService, confirmationService, loadingService);
  }

}
