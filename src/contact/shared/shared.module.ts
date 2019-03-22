import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZContactSharedSidebarComponent } from '@contacts/shared/sidebar/sidebar.component';
import { ZContactSearchSharedToolbarComponent } from '@contacts/shared/toolbar/search.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { WCountriesModule } from '@shared/components/w-countries/w-countries.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
// import { Ng2HdModule } from '@shared/shared/ng2-hd';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
// import { ComponentsModule } from '@wth/shared/components/components.module';
import { ModalModule } from '@wth/shared/components/modal/modal.module';
import { WMediaSelectionModule } from '@wth/shared/components/w-media-selection/w-media-selection.module';
import { PartialModule } from '@wth/shared/partials';
import { CoverProfileModule } from '@wth/shared/shared/components/cover-profile/cover-profile.module';
import { FileModule } from '@wth/shared/shared/components/file/file.module';
import { ZSharedMenuModule } from '@wth/shared/shared/components/menu/menu.module';
import { ModalDockModule } from '@wth/shared/shared/components/modal/dock.module';
import { StickyModule } from 'ng2-sticky-kit';
import { TagInputModule } from 'ngx-chips';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { DropdownModule } from 'primeng/primeng';
import { ZContactSharedHeaderComponent } from './header/header.component';
import { ZContactSharedItemComponent } from './list/item/item.component';
import { ZContactSharedListComponent } from './list/list.component';

import { ContactAddGroupModalComponent } from './modal/contact-add-group/contact-add-group-modal.component';
import { ZContactShareIcloudIndicateComponent } from './modal/import-contact/icloud-indicate/icloud-indicate.component';
import { ICloudOAuthComponent } from './modal/import-contact/icloud/icloud-oauth.component';
import { ZContactShareImportContactComponent } from './modal/import-contact/import-contact.component';
import { ZContactSharedSettingsComponent } from './modal/settings/settings.component';
import { ZContactPipeModule } from './pipe/pipe.module';
import { ZContactShareImportProgressComponent } from './progress/import-progress.component';
import { ZContactShareMergeProgressComponent } from './progress/merge-progress.component';
import { ZContactMenuService } from './services/contact-menu.service';
import { ZContactService } from './services/contact.service';

import { GoogleApiService } from './services/google-api.service';
import { ZContactSharedActionsBarComponent } from './toolbar/actions-bar.component';
import { ZContactSharedToolbarComponent } from './toolbar/toolbar.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ScrollingModule,

    // Wth common module
    WthCommonModule,

    // custom component
    // Ng2HdModule,
    ModalModule,
    WMediaSelectionModule,
    // ComponentsModule,
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
    DropdownModule,
    ScrollToModule,
    StickyModule,
    WCountriesModule
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
    ZContactSharedSidebarComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,

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
    // Ng2HdModule,
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    // ComponentsModule,
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
    WCountriesModule,

    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactShareMergeProgressComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedSidebarComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,
    ZContactSearchSharedToolbarComponent,

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
      providers: [ZContactService, GoogleApiService, ZContactMenuService]
    };
  }
}
