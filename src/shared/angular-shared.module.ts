/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

import { FormsModule, ReactiveFormsModule } from '@angular/forms/';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [],
  exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class AngularSharedModule {}
