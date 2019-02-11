import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ConversationEffects } from './conversation.effects';
import * as ConversationSelectors from './conversation.selectors';
import * as fromConversation from './conversation.reducer';
import { ZChatConversationModule } from '@chat/conversation/conversation.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(ConversationSelectors.FEATURE_NAME, fromConversation.reducer),
    EffectsModule.forFeature([ConversationEffects])
  ],
  providers: [
    // ConversationEffects
  ]
})
export class ConversationStoreModule { }
