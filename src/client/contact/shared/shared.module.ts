import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZContactSharedListComponent } from './list/list.component';
import { ZContactSharedItemComponent } from './list/item/item.component';
import { ZContactService } from './services/contact.service';
import { SharedModule } from '../../core/shared/shared.module';
import { ZContactSharedToolbarComponent } from './toolbar/toolbar.component';
import { ZContactSharedActionsBarComponent } from './actions/actions-bar/actions-bar.component';
import { ZContactSharedThreeDotActionComponent } from './actions/three-dot-actions/three-dot-actions.component';
import { ZContactThreeDotActionsService } from './actions/three-dot-actions/contact-three-dot.service';
import { ZContactShareAddContactComponent } from './modal/add-contact/add-contact.component';
import { ZContactAddContactService } from './modal/add-contact/add-contact.service';
import { GoogleApiService } from './services/google-api.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule.forRoot()
  ],
  declarations: [
    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedThreeDotActionComponent,
    ZContactShareAddContactComponent,
    ZContactSharedToolbarComponent
  ],
  exports: [
    CommonModule,
    RouterModule,

    ZContactSharedListComponent,
    ZContactSharedItemComponent,
    ZContactSharedActionsBarComponent,
    ZContactSharedThreeDotActionComponent,
    ZContactShareAddContactComponent,
    ZContactSharedToolbarComponent
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
