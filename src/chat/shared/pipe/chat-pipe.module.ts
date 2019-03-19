import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatUserOnlinePipe } from './chat-user-online.pipe';
import { ChatGroupPendingPipe } from './chat-group-pending.pipe';
import { ChatGroupSentRequestPipe } from './chat-group-sent-request.pipe';
import { ChatUserNewPipe } from './chat-user-new.pipe';
import { ChatMonthDayYearPipe } from './chat-month-day-year.pipe';
import { ChatGroupCouplePipe } from './chat-group-couple.pipe';
import { ChatGroupMultiplePipe } from './chat-group-multiple.pipe';
import { ChatGroupBlackListPipe } from './chat-group-black-list.pipe';
import { ChatGroupRecentPipe } from './chat-group-recent.pipe';
import { ChatGroupFavoritePipe } from './chat-group-favorite.pipe';
import { ChatGroupHistoryPipe } from './chat-group-history.pipe';
import { MessageDisplayPipe } from '@chat/shared/pipe/message-display.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatUserNewPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatUserOnlinePipe,
    ChatGroupRecentPipe,
    ChatGroupFavoritePipe,
    ChatGroupHistoryPipe,
    MessageDisplayPipe,
  ],
  exports: [
    CommonModule,

    ChatMonthDayYearPipe,
    ChatGroupCouplePipe,
    ChatGroupMultiplePipe,
    ChatGroupBlackListPipe,
    ChatUserNewPipe,
    ChatGroupSentRequestPipe,
    ChatGroupPendingPipe,
    ChatUserOnlinePipe,
    ChatGroupRecentPipe,
    ChatGroupFavoritePipe,
    ChatGroupHistoryPipe,
    MessageDisplayPipe,
  ],
  providers: []
})
export class ZChatPipeModule {}
