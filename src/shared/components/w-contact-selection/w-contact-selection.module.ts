import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BsModalModule } from 'ng2-bs3-modal';

import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WContactSelectionComponent } from './w-contact-selection.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { WSearchBoxModule } from '@shared/components/w-search-box/w-search-box.module';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    BoxNoDataModule,
    BoxLoadingModule,
    PipeModule,
    WSearchBoxModule
  ],
  declarations: [
    WContactSelectionComponent
  ],
  exports: [
    WContactSelectionComponent
  ],
  providers: [
    DatePipe
  ],
})
export class WContactSelectionModule {
}
