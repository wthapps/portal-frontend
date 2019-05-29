import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WBreadcrumbComponent } from '@shared/components/w-breadcrumbs/w-breadcrumbs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WBreadcrumbComponent
  ],
  exports: [
    WBreadcrumbComponent
  ]
})
export class WBreadcrumbsModule {
}
