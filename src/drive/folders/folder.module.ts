import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { MessageService } from 'primeng/api';

import { DriveService } from 'drive/shared/services/drive.service';
import { DriveFolderListComponent } from './folder.component';
import { MyDriveRoutingModule } from './folder-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [DriveFolderListComponent],
  exports: [DriveContainerModule, DriveFolderListComponent],
  providers: [ApiBaseService, DatePipe, MessageService, DriveService]
})
export class DriveFolderModule {}
