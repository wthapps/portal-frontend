import { NgModule } from '@angular/core';
import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { MyAdminRoutingModule } from './admin-routing.module';

import { MyAdminComponent } from './admin.component';
import { AccountListComponent } from './accounts/account-list.component';
import { MyInvitationsComponent } from './invitations/invitations.component';
import { AccountEditModalComponent } from './accounts/modal/account-edit-modal.component';
import { PipeModule } from '../../core/shared/pipe/pipe.module';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatNativeDateModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,

    Ng2Bs3ModalModule,
    PipeModule,
    MyAdminRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyAdminComponent,
    MyInvitationsComponent,

    // Account
    AccountListComponent
  ],
  exports: [
    MyAdminComponent,
    MyInvitationsComponent,

    // Account
    AccountListComponent
  ],
  providers: []
})

export class MyAdminModule {
}
