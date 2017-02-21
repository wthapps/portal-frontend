import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatHistoryRoutingModule } from './history-routing.module';
import { ZChatHistoryComponent } from './history.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatHistoryRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatHistoryComponent
  ],
  exports: [
    ZChatHistoryComponent
  ],
  providers: []
})

export class ZChatHistoryModule {
}
