import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';
import { CoreChatSupportDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CoreChatSupportComponent,
    CoreChatSupportDetailComponent
  ],
  exports: [
    CoreChatSupportComponent,
    CoreChatSupportDetailComponent
  ],
  providers: []
})

export class CoreChatSupportModule {
}
