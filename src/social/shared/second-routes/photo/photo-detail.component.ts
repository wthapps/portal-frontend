import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { PhotoService } from '@wth/shared/services';

@Component({
  selector: 'photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.scss'],
  entryComponents: []
})

export class PhotoDetailComponent extends BasePhotoDetailComponent {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected wthConfirmService: WthConfirmService,
    protected loadingService: LoadingService,
    protected photoService: PhotoService,
  ) {
    super(route, router, wthConfirmService, loadingService, photoService);
  }

}
