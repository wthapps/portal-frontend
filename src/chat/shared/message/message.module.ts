import { NgModule } from '@angular/core';
import { MessageEditorComponent } from './editor/message-editor.component';
import { MessageListComponent } from './message-list.component';
import { MessageItemComponent } from './message-item.component';
import { ZChatShareItemRequestComponent } from './item-request.component';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { ZChatShareUserIconComponent } from '../user/user-icon.component';
import { MessageItemSimpleComponent } from './messages/message-simple-item.component';
import { MessageItemActionComponent } from './messages/message-actions-item.component';
import { SharedModule } from '@wth/shared/shared.module';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';

@NgModule({
  imports: [
    MiniEditorModule,
    ChatNoteListModule,
    SharedModule.forRoot(),
    SharedServicesModule.forRoot()
  ],
  declarations: [
    MessageEditorComponent,
    MessageListComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ZChatShareUserIconComponent,
    MessageItemActionComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  exports: [
    MessageEditorComponent,
    MessageListComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ZChatShareUserIconComponent,
    MessageItemActionComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  providers: []
})
export class ZChatMessageModule {}
