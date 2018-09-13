import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ChatPhotoDetailComponent } from './photo-detail.component';
import { ZChatPhotoRoutingModule } from './photo-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
// import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatPhotoRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot(),
    // SharedServicesModule.forRoot()
  ],
  declarations: [ChatPhotoDetailComponent],
  exports: [ChatPhotoDetailComponent],
  providers: []
})
export class ZChatPhotoModule {}
