import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ChatPhotoDetailComponent } from './photo-detail.component';
import { ZChatPhotoRoutingModule } from './photo-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatPhotoRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ChatPhotoDetailComponent
  ],
  exports: [
    ChatPhotoDetailComponent
  ],
  providers: []
})

export class ZChatPhotoModule {
}
