import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatConversationGlobalComponent } from './conversation-global.component';
import { ZChatNewConversationComponent } from './new-conversation.component';
import { ZChatConversationRoutingModule } from './conversation-routing.module';
import { ZChatConversationComponent } from './conversation.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatConversationRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatConversationGlobalComponent,
    ZChatNewConversationComponent,
    ZChatConversationComponent
  ],
  exports: [
    ZChatConversationGlobalComponent,
    ZChatNewConversationComponent,
    ZChatConversationComponent
  ],
  providers: []
})

export class ZChatConversationModule {
}
