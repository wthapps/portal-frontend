import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { RouterModule } from '@angular/router';
import { PanelModule, PanelMenuModule, TooltipModule, MessageService } from 'primeng/primeng';
import { DriveUploadDockComponent } from './drive-upload-dock.component';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InfiniteScrollModule,
    PanelModule,
    PanelMenuModule,
    ModalDockModule,
    BsModalModule,
    PipeModule,
    TooltipModule,
    DirectiveModule
  ],
  declarations: [DriveUploadDockComponent],
  exports: [DriveUploadDockComponent],
  providers: [ApiBaseService]
})
export class WDriveUploadDockModule {
}
