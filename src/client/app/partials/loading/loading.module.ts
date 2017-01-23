import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/components/dialog/dialog';

import { LoadingComponent } from './loading.component';
import { LoadingService } from './loading.service';

@NgModule({
  imports: [
    CommonModule,
    DialogModule
  ],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
  providers: [LoadingService]
})

export class LoadingModule {
}
