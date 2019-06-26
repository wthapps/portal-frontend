import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NotificationEffects } from './notification.effects';
import * as NotificationSelectors from './notification.selectors';
import * as fromNotification from './notification.reducer';
import { ConversationService } from '@shared/services/chat';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(NotificationSelectors.FEATURE_NAME, fromNotification.reducer),
    EffectsModule.forFeature([NotificationEffects])
  ],
  providers: [
    ConversationService
  ]
})
export class NotificationStoreModule { }
