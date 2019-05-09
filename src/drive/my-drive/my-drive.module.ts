import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { DriveService } from 'drive/shared/services/drive.service';
import { MyDriveComponent } from './my-drive.component';
import { MyDriveRoutingModule } from './my-drive-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [MyDriveComponent],
  exports: [DriveContainerModule, MyDriveComponent],
  providers: [ApiBaseService, DatePipe, MessageService, DriveService]
})
export class MyDriveModule {}
