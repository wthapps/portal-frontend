import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserEventModule } from '@shared/user/event';
import { ContactListModalComponent } from '@chat/contact/contact-list-modal.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { ZChatShareUserModule } from '@chat/shared/user/user.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { TooltipModule } from 'primeng/primeng';
import { UserActionsComponent } from '@chat/contact/user-actions.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    TooltipModule,
    BsModalModule,

    WNavTabModule,
    BoxLoadingModule,
    BoxNoDataModule,
    ZChatShareUserModule,
    // UserEventModule
  ],
  declarations: [
    UserActionsComponent,
    ContactListModalComponent
  ],
  exports: [
    ContactListModalComponent
  ],
  providers: []
})
export class ZChatContactModule { }
