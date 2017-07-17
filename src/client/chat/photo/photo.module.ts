import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ChatPhotoDetailComponent } from './photo-detail.component';
import { ZChatPhotoRoutingModule } from './photo-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatPhotoRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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
