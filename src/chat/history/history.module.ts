import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatHistoryRoutingModule } from './history-routing.module';
import { ZChatHistoryComponent } from './history.component';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatHistoryRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [ZChatHistoryComponent],
  exports: [ZChatHistoryComponent],
  providers: []
})
export class ZChatHistoryModule {}
