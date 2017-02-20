import { NgModule } from '@angular/core';

import { ZChatContactActionsComponent } from './contact/contact-actions.component';
import { SharedModule } from '../../../core/shared/shared.module';
import { ChatSharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatContactActionsComponent
  ],
  exports: [
    ZChatContactActionsComponent
  ],
  providers: []
})

export class ZChatContactSharedModule {
}
