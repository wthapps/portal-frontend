import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCardModule } from './../../../../shared/user/card/user-card.module';
import { ZChatCardDetailModalComponent } from './chat-card-detail-modal.component';

@NgModule({
  imports: [CommonModule, UserCardModule],
  declarations: [ZChatCardDetailModalComponent],
  exports: [CommonModule, UserCardModule, ZChatCardDetailModalComponent],
  providers: []
})
export class ZChatCardModule {}
