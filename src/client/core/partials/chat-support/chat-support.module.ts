import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { ChatSupportListComponent } from './chat-support-list.component';
import { ChatSupportDetailComponent } from './chat-support-detail.component';
import { ChatSupportUserInfoComponent } from './chat-support-user-info.component';
import { ChatSupportDirective } from './chat-support.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent,
    ChatSupportUserInfoComponent,
    ChatSupportDirective
  ],
  exports: [
    CoreChatSupportComponent,
    ChatSupportListComponent,
    ChatSupportDetailComponent,
    ChatSupportUserInfoComponent,
    ChatSupportDirective
  ],
  providers: [],
  entryComponents:[ChatSupportListComponent, ChatSupportDetailComponent]
})

export class CoreChatSupportModule {
}
