import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageEditorComponent } from './editor/message-editor.component';
import { MessageListComponent } from './message-list.component';
import { MessageItemComponent } from './message-item.component';
import { ZChatShareItemRequestComponent } from './item-request.component';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { ZChatShareUserIconComponent } from '../user/user-icon.component';
import { MessageItemSimpleComponent } from './messages/message-simple-item.component';
import { MessageItemActionComponent } from './messages/message-actions-item.component';
import { LockUploadModal } from './modals/lock-upload-modal.component';
import { SharedModule } from '@wth/shared/shared.module';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';

@NgModule({
  imports: [
    CommonModule,
    MiniEditorModule,
    SharedModule.forRoot()
  ],
  declarations: [
    MessageEditorComponent,
    MessageListComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ZChatShareUserIconComponent,
    MessageItemActionComponent,
    MessageItemSimpleComponent,
    LockUploadModal,
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
    LockUploadModal,
    MessageItemComponent
  ],
  providers: [

  ]
})

export class ZChatMessageModule {
}
