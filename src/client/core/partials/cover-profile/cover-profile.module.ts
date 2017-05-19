import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverProfileComponent } from './component/cover-profile.component';
import { ProfileComponent } from './component/profile.component';
import { CoverComponent } from './component/cover.component';
import { InformationComponent } from './component/information.component';
import { PhotoUploadService } from '../../shared/services/photo-upload.service';
import { PhotoModalDataService } from '../../shared/services/photo-modal-data.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [CoverComponent,
    ProfileComponent,
    InformationComponent,
    CoverProfileComponent
  ],
  exports: [CoverComponent,
    ProfileComponent,
    InformationComponent,
    CoverProfileComponent],
  providers: [
    PhotoModalDataService,
    PhotoUploadService]
})

export class CoverProfileModule {
}
