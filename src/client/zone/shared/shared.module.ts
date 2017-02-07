import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';

import { ZSharedMenuComponent } from './menu/menu.component';
import { ZSharedAutoCompleteModule } from './auto-complete/auto-complete.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule,
    ZSharedAutoCompleteModule
  ],
  declarations: [
    ZSharedMenuComponent
  ],
  exports: [
    ZSharedMenuComponent,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    AutoCompleteModule,
    ZSharedAutoCompleteModule
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
