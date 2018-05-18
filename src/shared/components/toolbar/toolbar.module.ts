import { NgModule } from '@angular/core';

import { WToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { WUploadModule } from '@shared/components/upload/upload.module';
import { WUploadComponent } from '@shared/components/upload/upload.component';

@NgModule({
  imports: [CommonModule, TooltipModule, WUploadModule],
  declarations: [WToolbarComponent, WUploadComponent],
  exports: [WToolbarComponent],
  providers: []
})
export class WToolbarModule {}
