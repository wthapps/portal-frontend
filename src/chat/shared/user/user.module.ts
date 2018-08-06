import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatShareUserComponent } from '@chat/shared/user/user.component';
import { ZChatShareUserIconComponent } from '@chat/shared/user/user-icon.component';
import { ZChatShareUserAvatarComponent } from '@chat/shared/user/user-avatar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent
  ],
  exports: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent
  ],
  providers: []
})
export class ZChatShareUserModule {}
