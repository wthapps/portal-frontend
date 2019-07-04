import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { StorageDetailModalComponent } from './storage-detail-modal.component';
import { StorageUpgradeModalComponent } from './storage-upgrade-modal.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { RadioButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PipeModule,
    BsModalModule,
    RadioButtonModule
  ],
  declarations: [
    StorageDetailModalComponent,
    StorageUpgradeModalComponent
  ],
  exports: [
    StorageDetailModalComponent,
    StorageUpgradeModalComponent
  ],
  providers: [StorageService]
})
export class StorageModule {}
