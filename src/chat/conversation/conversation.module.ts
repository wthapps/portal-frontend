import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ConversationListComponent } from './conversation-list.component';
import { ZChatConversationRoutingModule } from './conversation-routing.module';
import { ConversationDetailComponent } from './conversation-detail.component';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { ZChatNewConversationComponent } from './new-conversation.component';
import { ZChatMessageModule } from '@chat/shared/message/message.module';
import { ConversationService } from '@shared/services/chat';
import { UserCardModule } from '@shared/user/card';
import { ProfileModule } from '@shared/user';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ModalModule,
    ZChatConversationRoutingModule,
    ZChatMessageModule,
    ZChatSharedModule,
    UserCardModule,
    ProfileModule,
  ],
  declarations: [
    ConversationListComponent,
    ConversationDetailComponent,
    ZChatNewConversationComponent
  ],
  exports: [
    ZChatMessageModule,

    ConversationListComponent,
    ConversationDetailComponent,
    ZChatNewConversationComponent
  ],
  providers: [
    ConversationService
  ]
})
export class ZChatConversationModule {}
