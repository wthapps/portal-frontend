import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NotificationStoreModule } from '@core/store/notification';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,

    // common store
    NotificationStoreModule,

    // local store

    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ]
})
export class NoteStoreModule { }
