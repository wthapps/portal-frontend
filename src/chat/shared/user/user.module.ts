import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatShareUserComponent } from '@chat/shared/user/user.component';
import { ZChatShareUserIconComponent } from '@chat/shared/user/user-icon.component';
import { ZChatShareUserAvatarComponent } from '@chat/shared/user/user-avatar.component';
import { UserChatComponent } from '@chat/shared/user/user-chat.component';
import { UserActionsComponent } from '@chat/shared/user/user-actions.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent,
    UserChatComponent,
    UserActionsComponent
  ],
  exports: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent,
    UserChatComponent,
    UserActionsComponent
  ],
  providers: []
})
export class ZChatShareUserModule {}
