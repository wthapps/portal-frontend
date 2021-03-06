import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatShareUserComponent } from '@chat/shared/user/user.component';
import { ZChatShareUserIconComponent } from '@chat/shared/user/user-icon.component';
import { ZChatShareUserAvatarComponent } from '@chat/shared/user/user-avatar.component';
import { UserChatComponent } from '@chat/shared/user/user-chat.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { ZChatPipeModule } from '../pipe/chat-pipe.module';

@NgModule({
  imports: [CommonModule, PipeModule, ZChatPipeModule],
  declarations: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent,
    UserChatComponent,
  ],
  exports: [
    ZChatShareUserComponent,
    ZChatShareUserIconComponent,
    ZChatShareUserAvatarComponent,
    UserChatComponent,
  ],
  providers: []
})
export class ZChatShareUserModule {}
