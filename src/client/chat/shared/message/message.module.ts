import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageEditorComponent } from "./editor/message-editor.component";
import { MessageListComponent } from "./message-list.component";
import { MessageItemComponent } from "./message-item.component";
import { CoreSharedModule } from "../../../core/shared/shared.module";
import { ZChatShareItemRequestComponent } from "./item-request.component";
import { ZChatShareRequestContactComponent } from "../modal/request-contact.component";
import { ZChatShareUserIconComponent } from "../user/user-icon.component";
import { MessageItemSimpleComponent } from "./messages/message-simple-item.component";
import { MessageItemActionComponent } from "./messages/message-actions-item.component";

@NgModule({
  imports: [
    CommonModule,
    CoreSharedModule.forRoot()
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
  providers: [

  ]
})

export class ZChatMessageModule {
}
