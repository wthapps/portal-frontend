import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactRoutingModule } from './contact-routing.module';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';
import { ZChatContactMenuComponent } from './components/navigation.component';
import { ZChatContactSentRequestComponent } from './contact-sent-request.component';
import { ZChatContactPendingComponent } from './contact-pending.component';
import { ZChatContactReceiveComponent } from './contact-receive.component';
import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot()
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
