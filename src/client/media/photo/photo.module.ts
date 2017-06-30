import { NgModule } from '@angular/core';
import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaPhotoListComponent } from './photo-list.component';
import { ZMediaPhotoRoutingModule } from './photo-routing.module';
import { PhotoService } from '../../core/shared/services/photo.service';
import { PhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    ZMediaPhotoRoutingModule,
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaPhotoListComponent,
    PhotoDetailComponent
  ],
  exports: [
    ZMediaPhotoListComponent,
    PhotoDetailComponent
  ],
  providers: [
    PhotoService
  ]
})

export class ZMediaPhotoModule {
}
