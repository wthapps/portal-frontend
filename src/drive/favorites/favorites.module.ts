import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { MessageService } from 'primeng/api';

import { FavoritesComponent } from './favorites.component';
import { MyDriveRoutingModule } from './favorites-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';

@NgModule({
  imports: [CommonModule, MyDriveRoutingModule, DriveContainerModule],
  declarations: [FavoritesComponent],
  exports: [DriveContainerModule, FavoritesComponent],
  providers: [ApiBaseService, DatePipe, MessageService]
})
export class FavoritesModule { }
