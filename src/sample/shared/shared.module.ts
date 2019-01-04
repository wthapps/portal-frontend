import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BoxNoDataModule,

    // Directive
    DirectiveModule
  ]
})
export class SampleSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SampleSharedModule,
      providers: []
    };
  }
}
