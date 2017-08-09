import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZContactSharedListComponent } from './list/list.component';
import { ZContactSharedItemComponent } from './list/item/item.component';
import { ZContactService } from './services/contact.service';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZContactSharedToolbarComponent } from './toolbar/toolbar.component';

import { GoogleApiService } from './services/google-api.service';
import { TagInputModule } from 'ngx-chips';

import { ContactAddLabelModalComponent } from './modal/contact-add-label/contact-add-label-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZContactShareImportContactComponent } from './modal/import-contact/import-contact.component';
import { ZContactShareImportProgressComponent } from './progress/import-progress.component';
import { ContactImportContactDataService } from './modal/import-contact/import-contact-data.service';
import { ZContactSharedSettingsComponent } from './modal/settings/settings.component';
import { ZContactMenuService } from './services/contact-menu.service';
import { ZContactSharedActionsBarComponent } from './toolbar/actions-bar.component';
import { ZContactPipeModule } from './pipe/pipe.module';

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

    // third party libs
    TagInputModule,

    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedActionsBarComponent,

    //modal here
    ContactAddLabelModalComponent,
    ZContactSharedSettingsComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    ZContactPipeModule,

    // third party libs
    TagInputModule,


    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedToolbarComponent,
    ZContactShareImportProgressComponent,
    ZContactShareImportContactComponent,
    ZContactSharedToolbarComponent,
    ZContactSharedActionsBarComponent,

    // modal here
    ContactAddLabelModalComponent,
    ZContactSharedSettingsComponent
  ]
})
export class ZContactSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZContactSharedModule,
      providers: [
        ZContactService,
        GoogleApiService,
        ZContactMenuService,
        ContactImportContactDataService
      ]
    };
  }
}
