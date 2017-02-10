import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactRoutingModule } from './contact-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatContactComponent
  ],
  exports: [
    ZChatContactComponent
  ],
  providers: []
})

export class ZChatContactModule {
}
