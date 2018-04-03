import { NgModule } from '@angular/core';
import { MySharedModule } from '../shared/shared.module';
import { MyAdminRoutingModule } from './admin-routing.module';

import { SharedModule } from '@wth/shared/shared.module';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';

import { MyAdminComponent } from './admin.component';
import { AccountListComponent } from './accounts/account-list.component';
import { MyInvitationsComponent } from './invitations/invitations.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountCreatePartialComponent } from './accounts/account-create-partial.component';
import { AccountRequestOwnershipModalComponent } from '@account/admin/accounts/account-request-ownership-modal.component';
// import { MatInputModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // MatNativeDateModule, // TODO fix
    // MatInputModule,

    BsModalModule,
    PipeModule,
    MyAdminRoutingModule,
    MySharedModule,
    SharedModule
  ],
  declarations: [
    MyAdminComponent,
    MyInvitationsComponent,

    // Account
    AccountListComponent,
    AccountCreatePartialComponent,
    AccountRequestOwnershipModalComponent
  ],
  exports: [
    MyAdminComponent,
    MyInvitationsComponent,

    // Account
    AccountListComponent,
    AccountCreatePartialComponent
  ],
  providers: []
})
export class MyAdminModule {}
