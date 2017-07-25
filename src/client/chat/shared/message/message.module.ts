import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageEditorComponent } from "./editor/message-editor.component";
import { MessageListComponent } from "./message-list.component";
import { MessageItemComponent } from "./message-item.component";
import { SharedModule } from "../../../core/shared/shared.module";
import { ZChatShareItemRequestComponent } from "./item-request.component";
import { ZChatShareRequestContactComponent } from "../modal/request-contact.component";
import { ZChatShareUserIconComponent } from "../user/user-icon.component";
import { MessageItemRequestComponent } from "./messages/message-request-item.component";
import { MessageItemSimpleComponent } from "./messages/message-simple-item.component";

@NgModule({
  imports: [
    SharedModule.forRoot(),
    // ZChatEmojiModule
  ],
  declarations: [
    MessageEditorComponent,
    MessageListComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ZChatShareUserIconComponent,
    MessageItemRequestComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  exports: [
    MessageEditorComponent,
    MessageListComponent,
    ZChatShareItemRequestComponent,
    ZChatShareRequestContactComponent,
    ZChatShareUserIconComponent,
    MessageItemRequestComponent,
    MessageItemSimpleComponent,
    MessageItemComponent
  ],
  providers: [

  ]
})

export class ZChatMessageModule {
}
