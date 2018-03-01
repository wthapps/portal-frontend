import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { MySharedMenuComponent } from './menu/menu.component';
import { SubscriptionEditModalComponent } from './subscription/modal/subscription-edit-modal.component';
import {
  AccountListEditModalComponent,
  AccountEditModalComponent,
  AccountDeleteModalComponent,
  AccountRequestSendModalComponent,
  AccountRequestAcceptModalComponent
} from './account/modal/index';
import { AccountService } from './account/account.service';
import { SubscriptionService } from './subscription/subscription.service';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';



/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,

    BsModalModule,
    SharedModule
  ],
  declarations: [
    MySharedMenuComponent,

    // modals
    AccountEditModalComponent,
    AccountDeleteModalComponent,
    AccountRequestSendModalComponent,
    AccountRequestAcceptModalComponent,
    AccountListEditModalComponent,
    SubscriptionEditModalComponent
  ],
  exports: [
    MySharedMenuComponent,

    // modals
    AccountEditModalComponent,
    AccountDeleteModalComponent,
    AccountRequestSendModalComponent,
    AccountRequestAcceptModalComponent,
    AccountListEditModalComponent,
    SubscriptionEditModalComponent,
    SharedModule
  ]
})
export class MySharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MySharedModule,
      providers: [
        AccountService,
        SubscriptionService
      ]
    };
  }
}
