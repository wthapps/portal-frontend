import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { ChatSupportListComponent } from './chat-support-list.component';
import { ChatSupportDetailComponent } from './chat-support-detail.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent
  ],
  exports: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent
  ],
  providers: []
})

export class CoreChatSupportModule {
}
