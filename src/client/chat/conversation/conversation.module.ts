import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ConversationListComponent } from './conversation-list.component';
import { ZChatConversationRoutingModule } from './conversation-routing.module';
import { ConversationDetailComponent } from './conversation-detail.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatConversationRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ConversationListComponent,
    ConversationDetailComponent
  ],
  exports: [
    ConversationListComponent,
    ConversationDetailComponent
  ],
  providers: []
})

export class ZChatConversationModule {
}
