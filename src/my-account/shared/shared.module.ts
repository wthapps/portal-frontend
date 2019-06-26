import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

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
// import { SharedModule } from '@shared/shared.module';
import { AccountConfirmPasswordModalComponent } from '@account/shared/account/modal/account-confirm-password-modal.component';
import { WthCommonModule } from '@shared/common/wth-common.module';
// import { Ng2HdModule } from '@shared/shared/ng2-hd';
// import { ModalModule } from '@wth/shared/components/modal/modal.module';
// import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { ComponentsModule } from '@shared/components/components.module';
import { FileModule } from '@shared/shared/components/file/file.module';
import { PartialModule } from '@shared/partials';
import { CoverProfileModule } from '@shared/shared/components/cover-profile/cover-profile.module';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
// import { ZSharedMenuModule } from '@shared/shared/components/menu/menu.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { TagInputModule } from 'ngx-chips';
import {
  InputSwitchModule,
  CheckboxModule,
  RadioButtonModule,
  AutoCompleteModule,
  CalendarModule,
  PanelMenuModule,
  TooltipModule,
  DropdownModule
} from 'primeng/primeng';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StickyModule } from 'ng2-sticky-kit';
import { WCountriesModule } from '@shared/components/w-countries/w-countries.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BreadcrumbModule } from '@shared/shared/components/breadcrumb/breadcrumb.module';
import { TableModule } from 'primeng/table';
import { TablePricingModule } from '@shared/shared/components/table-pricing/table-pricing.module';
import { MySharedMenuModule } from './menu/menu.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    BsModalModule,
    WthCommonModule,
    MySharedMenuModule,

    // custom component
    BreadcrumbModule,
    ComponentsModule,
    FileModule,
    PartialModule,
    ModalDockModule,
    BoxNoDataModule,
    WNavTabModule,
    TablePricingModule,

    // third party libs
    TagInputModule,
    TableModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,
    DropdownModule,
    ScrollToModule,
    StickyModule,
    WCountriesModule
    // SharedModule
  ],
  declarations: [
    // modals
    AccountEditModalComponent,
    AccountDeleteModalComponent,
    AccountRequestSendModalComponent,
    AccountRequestAcceptModalComponent,
    AccountListEditModalComponent,
    AccountConfirmPasswordModalComponent,
    SubscriptionEditModalComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    BsModalModule,
    WthCommonModule,

    // custom component
    BreadcrumbModule,
    ModalDockModule,
    FileModule,
    PartialModule,
    ComponentsModule,
    BoxNoDataModule,
    WNavTabModule,
    TablePricingModule,

    // third party libs
    TagInputModule,
    TableModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,
    WCountriesModule,

    MySharedMenuModule,

    // modals
    AccountEditModalComponent,
    AccountDeleteModalComponent,
    AccountRequestSendModalComponent,
    AccountRequestAcceptModalComponent,
    AccountListEditModalComponent,
    AccountConfirmPasswordModalComponent,
    SubscriptionEditModalComponent
    // SharedModule
  ]
})
export class MySharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MySharedModule,
      providers: [AccountService, SubscriptionService]
    };
  }
}
