import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactRoutingModule } from './contact-routing.module';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';
import { ZChatContactMenuComponent } from './components/navigation.component';
import { ZChatContactSentRequestComponent } from './contact-sent-request.component';
import { ZChatContactPendingComponent } from './contact-pending.component';
import { ZChatContactReceiveComponent } from './contact-receive.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatContactComponent,
    ZChatContactBlackListComponent,
    ZChatContactMenuComponent,
    ZChatContactPendingComponent,
    ZChatContactSentRequestComponent,
    ZChatContactReceiveComponent,
    ZChatContactOnlineComponent
  ],
  exports: [
    ZChatContactComponent,
    ZChatContactBlackListComponent,
    ZChatContactMenuComponent,
    ZChatContactPendingComponent,
    ZChatContactSentRequestComponent,
    ZChatContactReceiveComponent,
    ZChatContactOnlineComponent
  ],
  providers: []
})

export class ZChatContactModule {
}
