import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreChatSupportComponent } from './chat-support.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CoreChatSupportComponent],
  exports: [CoreChatSupportComponent],
  providers: []
})

export class CoreChatSupportModule {
}
