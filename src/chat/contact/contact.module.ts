import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatContactComponent } from './contact.component';
import { ZChatContactRoutingModule } from './contact-routing.module';
import { ZChatContactOnlineComponent } from './contact-online.component';
import { ZChatContactBlackListComponent } from './contact-black-list.component';
import { ZChatContactMenuComponent } from './components/navigation.component';
import { ZChatContactReceiveComponent } from './contact-receive.component';
import { ContactListModalComponent } from '@chat/contact/contact-list-modal.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactRoutingModule,
    ZChatSharedModule,
  ],
  declarations: [
    ZChatContactComponent,
    ZChatContactBlackListComponent,
    ZChatContactMenuComponent,
    ZChatContactReceiveComponent,
    ZChatContactOnlineComponent
  ],
  exports: [
    ZChatContactComponent,
    ZChatContactBlackListComponent,
    ZChatContactMenuComponent,
    ZChatContactReceiveComponent,
    ZChatContactOnlineComponent
  ],
  providers: []
})
export class ZChatContactModule {}
