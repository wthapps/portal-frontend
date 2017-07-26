import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZChatHistoryRoutingModule } from './history-routing.module';
import { ZChatHistoryComponent } from './history.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatHistoryRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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
