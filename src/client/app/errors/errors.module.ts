import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './page404.component';
import { Page500Component } from './page500.component';
import { SharedModule } from '../shared/shared.module';
import { PageErrorsRoutingModule } from './errors-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PageErrorsRoutingModule
  ],
  declarations: [
    Page404Component,
    Page500Component
  ],
  exports: [
    Page404Component,
    Page500Component
  ]
})
export class PageErrorsModule {
}
