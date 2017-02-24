import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { CoreChatSupportListComponent } from './list/list.component';
import { CoreChatSupportDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    CoreChatSupportListComponent,
    CoreChatSupportDetailComponent
  ],
  exports: [
    CoreChatSupportComponent,
    CoreChatSupportListComponent,
    CoreChatSupportDetailComponent
  ],
  providers: []
})

export class CoreChatSupportModule {
}
