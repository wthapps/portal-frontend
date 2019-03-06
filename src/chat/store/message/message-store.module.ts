import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromMessage from './message.reducer';
import { MessageEffects } from './message.effects';
import { MessageService } from '@chat/shared/message/message.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ZChatMessageModule,
    StoreModule.forFeature(fromMessage.FEATURE_NAME, fromMessage.reducer),
    EffectsModule.forFeature([MessageEffects]),
  ],
  providers: [
    // MessageEffects
    MessageService
  ]
})
export class MessageStoreModule { }





