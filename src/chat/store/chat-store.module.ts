import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationStoreModule } from './conversation';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MessageStoreModule } from '@chat/store/message';
import { NotificationStoreModule } from '@core/store/notification';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,

    // common store
    NotificationStoreModule,

    // local store
    ConversationStoreModule,
    MessageStoreModule,

    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ]
})
export class ChatStoreModule { }
