import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationStoreModule } from './conversation';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ConversationStoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ]
})
export class AppStoreModule { }
