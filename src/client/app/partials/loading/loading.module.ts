import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { DialogModule } from 'primeng/primeng';

import { LoadingComponent } from './loading.component';
import { LoadingService } from './loading.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DialogModule
  ],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
  providers: [LoadingService]
})

export class LoadingModule {
}
