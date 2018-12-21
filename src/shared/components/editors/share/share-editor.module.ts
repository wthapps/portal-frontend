import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { BoxNoDataModule } from '../../../shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '../../../shared/components/box-loading/box-loading.module';
import { PipeModule } from '../../../shared/pipe/pipe.module';
import { ShareEditorComponent } from './share-editor.component';
import { AutoCompleteModule, TooltipModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AutoCompleteModule,
    TooltipModule,
    BsModalModule,

    BoxNoDataModule,
    BoxLoadingModule,
    PipeModule,
  ],
  declarations: [
    ShareEditorComponent
  ],
  exports: [
    ShareEditorComponent
  ],
  providers: [
    DatePipe
  ],
})
export class ShareEditorModule {
}
