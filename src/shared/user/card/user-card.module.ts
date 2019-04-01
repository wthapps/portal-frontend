import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule, TooltipModule } from 'primeng/primeng';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

import {
  CardDetailModalComponent
} from './card-detail-modal.component';

import { AutofocusModule } from '@shared/directives/autofocus';
import { UserPipeModule } from '@shared/user/pipe/user-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,
    UserPipeModule,
    AutofocusModule
  ],
  declarations: [
    CardDetailModalComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CardDetailModalComponent,
  ],
  providers: []
})
export class UserCardModule {}
