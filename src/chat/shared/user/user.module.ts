import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatShareUserComponent } from '@chat/shared/user/user.component';
import { ZChatShareUserIconComponent } from '@chat/shared/user/user-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent
  ],
  exports: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent
  ],
  providers: []
})
export class ZChatShareUserModule {}
