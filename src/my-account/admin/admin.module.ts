import { NgModule } from '@angular/core';
import { MySharedModule } from '../shared/shared.module';
import { MyAdminRoutingModule } from './admin-routing.module';

import { SharedModule } from '@wth/shared/shared.module';
import { PipeModule } from   '@wth/shared/shared/pipe/pipe.module';


import { MyAdminComponent } from './admin.component';
import { AccountListComponent } from './accounts/account-list.component';
import { MyInvitationsComponent } from './invitations/invitations.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { MatInputModule, MatNativeDateModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // MatNativeDateModule, // TODO fix
    // MatInputModule,

    Ng2Bs3ModalModule,
    PipeModule,
    MyAdminRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot()
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
