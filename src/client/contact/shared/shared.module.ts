import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ZContactService } from './services/contact.service';
import { GoogleApiService } from './services/google-api.service';

import { ZContactAddContactService } from './modal/add-contact/add-contact.service';
import { ZContactSharedActionsBarComponent } from './actions/actions-bar/actions-bar.component';

import { ZContactThreeDotActionsService } from './actions/three-dot-actions/contact-three-dot.service';
import { ZContactSharedThreeDotActionComponent } from './actions/three-dot-actions/three-dot-actions.component';

import { ZContactSharedItemComponent } from './list/item/item.component';
import { ZContactSharedListComponent } from './list/list.component';
import { ZContactShareAddContactComponent } from './modal/add-contact/add-contact.component';
import { ContactAddLabelModalComponent } from './modal/contact-add-label/contact-add-label-modal.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ZContactSharedActionsBarComponent,
    ZContactSharedThreeDotActionComponent,
    ZContactSharedItemComponent,
    ZContactSharedListComponent,
    ZContactShareAddContactComponent,
    ContactAddLabelModalComponent
  ],
  exports: [
    ZContactSharedActionsBarComponent,
    ZContactSharedThreeDotActionComponent,
    ZContactSharedItemComponent,
    ZContactSharedListComponent,
    ZContactShareAddContactComponent,
    ContactAddLabelModalComponent
  ]
})
export class ZContactSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZContactSharedModule,
      providers: [
        ZContactService,
        GoogleApiService,
        ZContactAddContactService,
        ZContactThreeDotActionsService
      ]
    };
  }
}
