import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MessageService } from 'primeng/api';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { DriveContainerModule } from 'drive/shared/containers/drive-container.module';
import { ApiBaseService } from '@shared/services';

@NgModule({
  imports: [CommonModule, SearchRoutingModule, DriveContainerModule],
  declarations: [SearchComponent],
  exports: [DriveContainerModule, SearchComponent],
  providers: [ApiBaseService, DatePipe, MessageService]
})
export class SearchModule { }
