import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { SharingModalComponent } from './sharing-modal.component';
import { SharingService } from './sharing.service';
import { SharingModalService } from './sharing-modal.service';
import { WListComponentModule } from '@shared/components/list/list-component.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';

@NgModule({
  imports: [CommonModule, FormsModule, BsModalModule, AutoCompleteModule, WListComponentModule, CheckboxModule, ChipsModule],
  declarations: [SharingModalComponent],
  exports: [SharingModalComponent],
  providers: [SharingService, SharingModalService]
})
export class PartialsPhotoSharingModule { }
