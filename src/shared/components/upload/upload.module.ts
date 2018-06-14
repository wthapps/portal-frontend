import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { WUploadComponent } from '@shared/components/upload/upload.component';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [WUploadComponent],
  exports: [WUploadComponent],
  providers: []
})
export class WUploadModule {}
