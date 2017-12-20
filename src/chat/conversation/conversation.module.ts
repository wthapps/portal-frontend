import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ConversationListComponent } from './conversation-list.component';
import { ZChatConversationRoutingModule } from './conversation-routing.module';
import { ConversationDetailComponent } from './conversation-detail.component';
import { SharedModule } from '@wth/shared/shared.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { ZChatNewConversationComponent } from './new-conversation.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ModalModule,
    ZChatConversationRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ConversationListComponent,
    ConversationDetailComponent,
    ZChatNewConversationComponent
  ],
  exports: [
    ConversationListComponent,
    ConversationDetailComponent,
    ZChatNewConversationComponent
  ],
  providers: []
})

export class ZChatConversationModule {
}
