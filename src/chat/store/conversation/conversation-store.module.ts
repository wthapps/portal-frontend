import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ConversationEffects } from './conversation.effects';
import * as CONVERSATION_SELECTORS from './conversation.selectors';
import { conversationReducer } from './conversation.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(CONVERSATION_SELECTORS.FEATURE_CONVERSATION, conversationReducer),
    EffectsModule.forFeature([ConversationEffects])
  ]
})
export class ConversationStoreModule { }
