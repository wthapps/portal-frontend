import { NgModule, ModuleWithProviders } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { ContactImportContactDataService } from './modal/import-contact/import-contact-data.service';
import { ZContactSharedSettingsComponent } from './modal/settings/settings.component';
import { ZContactMenuService } from './services/contact-menu.service';
import { ZContactSharedActionsBarComponent } from './toolbar/actions-bar.component';
import { ZContactPipeModule } from './pipe/pipe.module';
import { ICloudOAuthComponent } from './modal/import-contact/icloud/icloud-oauth.component';
import { Ng2HdModule } from '../../shared/shared/ng2-hd/ng2-hd.module';
import { ZContactSharedHeaderComponent } from './header/header.component';
import { ZContactShareIcloudIndicateComponent } from './modal/import-contact/icloud-indicate/icloud-indicate.component';

import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';

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

    // custom component
    Ng2HdModule,

    // third party libs
    TagInputModule,
    // BrowserAnimationsModule,

    CoreModule,
    SharedModule
  ],
  declarations: [
    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,

    //modal here
    ContactAddGroupModalComponent,
    ZContactSharedSettingsComponent,
    ZContactShareIcloudIndicateComponent,
    ICloudOAuthComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    ZContactPipeModule,

    // custom component
    Ng2HdModule,


    // third party libs
    TagInputModule,

    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedHeaderComponent,

    // modal here
    ContactAddGroupModalComponent,
    ZContactSharedSettingsComponent,
    ZContactShareIcloudIndicateComponent,
    ICloudOAuthComponent,


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
        ContactImportContactDataService
      ]
    };
  }
}
