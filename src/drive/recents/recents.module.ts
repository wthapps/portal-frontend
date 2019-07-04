import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { MessageService } from 'primeng/api';

import { RecentsComponent } from './recents.component';
import { MyDriveRoutingModule } from './recents-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [RecentsComponent],
  exports: [DriveContainerModule, RecentsComponent],
  providers: [ApiBaseService, DatePipe, MessageService]
})
export class RecentsModule {}
