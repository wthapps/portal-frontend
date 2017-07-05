import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZContactSharedList } from './list/list.component';
import { ZContactSharedItem } from './list/item/item.component';
import { ZContactService } from './services/contact.service';
import { SharedModule } from '../../core/shared/shared.module';

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
    ZContactSharedList,
    ZContactSharedItem
  ],
  exports: [
    CommonModule,
    RouterModule,

    ZContactSharedList,
    ZContactSharedItem
  ]
})
export class ZContactSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZContactSharedModule,
      providers: [
        ZContactService
      ]
    };
  }
}
