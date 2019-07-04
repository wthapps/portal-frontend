import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WBreadcrumbsLiteComponent } from './w-breadcrumbs-lite.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WBreadcrumbsLiteComponent
  ],
  exports: [
    WBreadcrumbsLiteComponent
  ]
})
export class WBreadcrumbsLiteModule {
}
