import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { WNoteSelectionComponent } from '@shared/components/w-note-selection/w-note-selection.component';
import { WNoteSelectionService } from '@shared/components/w-note-selection/w-note-selection.service';
import { BsModalModule } from 'ng2-bs3-modal';

import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';

import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { PartialModule } from '@shared/partials';
import { WDataViewModule } from '../../../sample/shared/components/w-dataView/w-dataView.module';
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    WObjectListModule,
    PipeModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    BoxNoDataModule,
    BoxLoadingModule,
    PartialModule,
    WNavTabModule,
    WDataViewModule
  ],
  declarations: [
    WNoteSelectionComponent
  ],
  exports: [
    WNoteSelectionComponent
  ],
  providers: [
    DatePipe,
    WNoteSelectionService
  ]
})
export class WNoteSelectionModule {
}
