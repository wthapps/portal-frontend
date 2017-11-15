import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { MySharedMenuComponent } from './menu/menu.component';
import { SubscriptionEditModalComponent } from './subscription/modal/subscription-edit-modal.component';
import {
  AccountListEditModalComponent,
  AccountEditModalComponent,
  AccountDetailModalComponent
} from './account/modal/index';
import { AccountService } from './account/account.service';
import { SubscriptionService } from './subscription/subscription.service';

import { TooltipModule } from 'primeng/primeng';
import { CoreSharedModule } from '../../core/shared/shared.module';



/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    Ng2Bs3ModalModule,
    // TooltipModule,
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MySharedMenuComponent,

    // modals
    AccountEditModalComponent,
    AccountDetailModalComponent,
    AccountListEditModalComponent,
    SubscriptionEditModalComponent
  ],
  exports: [
    MySharedMenuComponent,

    // modals
    AccountEditModalComponent,
    AccountDetailModalComponent,
    AccountListEditModalComponent,
    SubscriptionEditModalComponent,
    CoreSharedModule
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
