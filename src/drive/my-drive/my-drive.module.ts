import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { MessageService } from 'primeng/api';

import { MyDriveComponent } from './my-drive.component';
import { MyDriveRoutingModule } from './my-drive-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [MyDriveComponent],
  exports: [DriveContainerModule, MyDriveComponent],
  providers: [ApiBaseService, DatePipe, MessageService]
})
export class MyDriveModule {}
