import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
  providers: []
})

export class BreadcrumbModule {
}
