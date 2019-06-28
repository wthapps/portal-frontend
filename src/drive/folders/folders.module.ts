import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { MessageService } from 'primeng/api';

import { DriveFolderListComponent } from './folders.component';
import { MyDriveRoutingModule } from './folders-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [DriveFolderListComponent],
  exports: [DriveContainerModule, DriveFolderListComponent],
  providers: [ApiBaseService, DatePipe, MessageService]
})
export class DriveFolderModule {}
