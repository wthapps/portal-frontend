import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashsRoutingModule } from './trashs-routing.module';
import { DriveTrashsComponent } from './trashs.component';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  declarations: [DriveTrashsComponent],
  imports: [CommonModule, DriveContainerModule, TrashsRoutingModule],
  exports: [DriveContainerModule, DriveTrashsComponent]
})
export class DriveTrashsModule {}
