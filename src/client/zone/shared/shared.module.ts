import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';

import { ZSharedMenuComponent } from './menu/menu.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule
  ],
  declarations: [
    ZSharedMenuComponent
  ],
  exports: [
    ZSharedMenuComponent,

    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule
  ]
})
export class ZSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSharedModule,
      providers: []
    };
  }
}
