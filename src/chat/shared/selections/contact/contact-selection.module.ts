import { NgModule } from '@angular/core';
import { PipeModule } from '../../../../shared/shared/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from '../../../../shared/components/modal/modal.module';
import {
  TooltipModule,
  InputSwitchModule,
  CheckboxModule,
  RadioButtonModule,
  AutoCompleteModule,
  CalendarModule,
  PanelMenuModule
} from 'primeng/primeng';

import { ZChatShareUserModule } from '../../user/user.module';
// import { ZChatPipeModule } from '../pipe/chat-pipe.module';
import { TagInputModule } from 'ngx-chips';
import { BoxLoadingModule } from '../../../../shared/shared/components/box-loading/box-loading.module';
import { ContactSelectionComponent } from './contact-selection.component';
import { ContactSelectionService } from './contact-selection.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libs
    TagInputModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,

    ModalModule,
    TooltipModule,
    PipeModule,
    // ZChatPipeModule,
    BoxLoadingModule,

    ZChatShareUserModule
  ],
  declarations: [
    ContactSelectionComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,

    ModalModule,
    // ZChatPipeModule,


    ContactSelectionComponent,
  ],
  providers: [
    ContactSelectionService
  ]
})
export class ContactSelectionModule {}
