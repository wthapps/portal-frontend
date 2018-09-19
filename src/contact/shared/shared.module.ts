import { NgModule, ModuleWithProviders } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZContactSharedLeftMenuComponent } from '@contacts/shared/toolbar/left-menu.component';
import { ZContactSharedListComponent } from './list/list.component';
import { ZContactSharedItemComponent } from './list/item/item.component';
import { ZContactService } from './services/contact.service';
import { ZContactSharedToolbarComponent } from './toolbar/toolbar.component';

import { GoogleApiService } from './services/google-api.service';
import { TagInputModule } from 'ngx-chips';

import { ContactAddGroupModalComponent } from './modal/contact-add-group/contact-add-group-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZContactShareImportContactComponent } from './modal/import-contact/import-contact.component';
import { ZContactShareImportProgressComponent } from './progress/import-progress.component';
import { ZContactSharedSettingsComponent } from './modal/settings/settings.component';
import { ZContactMenuService } from './services/contact-menu.service';
import { ZContactSharedActionsBarComponent } from './toolbar/actions-bar.component';
import { ZContactPipeModule } from './pipe/pipe.module';
import { ICloudOAuthComponent } from './modal/import-contact/icloud/icloud-oauth.component';
import { Ng2HdModule } from '../../shared/shared/ng2-hd/ng2-hd.module';
import { ZContactSharedHeaderComponent } from './header/header.component';
import { ZContactShareIcloudIndicateComponent } from './modal/import-contact/icloud-indicate/icloud-indicate.component';

import { CoreModule } from '../../core/core.module';
import { ZContactShareMergeProgressComponent } from './progress/merge-progress.component';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
// import { ZMyProfileComponent } from '@wth/shared/shared/components/profile/my-profile/my-profile.component';
import { ModalDockModule } from '@wth/shared/shared/components/modal/dock.module';
import { ComponentsModule } from '@wth/shared/components/components.module';
import { WMediaSelectionModule } from '@wth/shared/components/w-media-selection/w-media-selection.module';
import { ModalModule } from '@wth/shared/components/modal/modal.module';
import { PartialModule } from '@wth/shared/partials';
import { PartialsProfileModule } from '@wth/shared/shared/components/profile/profile.module';
import { CoverProfileModule } from '@wth/shared/shared/components/cover-profile/cover-profile.module';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { ZSharedMenuModule } from '@wth/shared/shared/components/menu/menu.module';
import { FileModule } from '@wth/shared/shared/components/file/file.module';
import { CheckForUpdateService } from '@contacts/shared/services/check-for-update.service';
import { LogUpdateService } from '@contacts/shared/services/log-update.service';
import { PromptUpdateService } from '@contacts/shared/services/prompt-update.service';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { ZContactSearchSharedToolbarComponent } from '@contacts/shared/toolbar/search.component';
import { ZContactSharedListV1Component } from '@contacts/shared/list/v1/list.component';
import { StickyModule } from 'ng2-sticky-kit';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ZContactPipeModule,

    // Wth common module
    WthCommonModule,

    // custom component
    Ng2HdModule,
    ModalModule,
    WMediaSelectionModule,
    ComponentsModule,
    FileModule,
    PartialModule,
    // PartialsProfileModule,
    CoverProfileModule,
    ModalDockModule,
    ZSharedMenuModule,
    WNavTabModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,
    ScrollToModule,
    StickyModule
    // BrowserAnimationsModule,
  ],
  declarations: [
    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactShareMergeProgressComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedLeftMenuComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,
    ZContactSharedListV1Component,

    // modal here
    ContactAddGroupModalComponent,
    ZContactSharedSettingsComponent,
    ZContactShareIcloudIndicateComponent,
    ZContactSearchSharedToolbarComponent,
    ICloudOAuthComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ZContactPipeModule,

    // custom component
    Ng2HdModule,
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    ZSharedMenuModule,
    BoxNoDataModule,
    WNavTabModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,

    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactShareMergeProgressComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedLeftMenuComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,
    ZContactSearchSharedToolbarComponent,
    ZContactSharedListV1Component,

    // // my profile
    // ZMyProfileComponent,

    // modal here
    ContactAddGroupModalComponent,
    ZContactSharedSettingsComponent,
    ZContactShareIcloudIndicateComponent,
    ICloudOAuthComponent
  ]
})
export class ContactSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ContactSharedModule,
      providers: [
        ZContactService,
        GoogleApiService,
        ZContactMenuService,

        // Service Workers services
        CheckForUpdateService,
        LogUpdateService,
        PromptUpdateService
      ]
    };
  }
}
