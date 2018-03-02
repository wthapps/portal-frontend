import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BsModalModule } from 'ng2-bs3-modal';

import { WMediaListModule } from '@shared/components/w-media-list/w-media-list.module';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';

import { WMediaSelectionComponent } from './w-media-selection.component';
import { WMediaSelectionService } from './w-media-selection.service';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    WMediaListModule,
    WObjectListModule,
    PipeModule,
    BoxNoDataModule,
    BoxLoadingModule
  ],
  declarations: [
    WMediaSelectionComponent
  ],
  exports: [
    WMediaSelectionComponent
  ],
  providers: [
    DatePipe
  ],
})
export class WMediaSelectionModule {
}
