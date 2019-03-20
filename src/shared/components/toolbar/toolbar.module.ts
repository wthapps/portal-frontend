import { NgModule } from '@angular/core';

import { WToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { WUploadModule } from '@shared/components/upload/upload.module';
import { PlaylistModalModule } from '@shared/modules/photo/components/modal/playlist/playlist-modal.module';

@NgModule({
  imports: [CommonModule, TooltipModule, WUploadModule, PlaylistModalModule],
  declarations: [WToolbarComponent],
  exports: [WToolbarComponent],
  providers: []
})
export class WToolbarModule { }
