import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { WDataViewModule } from '../../shared/components/w-dataView/w-dataView.module';
import { WModalsModule } from '../shared/components/modals/modals.module';

import { NoteRoutingModule } from './note-routing.module';
import { NNoteListComponent } from './list/list.component';
import { NoteService } from './shared/note.service';
import { NoteComponent } from './note.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forRoot(),
    FormsModule,
    NoteRoutingModule,
    WDataViewModule,
    LocalStorageModule.forRoot({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    BoxNoDataModule,
    BoxLoadingModule,
    WthConfirmModule,
    DirectiveModule,
    ToastModule,
    WModalsModule,
    PipeModule
  ],
  declarations: [
    NNoteListComponent,
    NoteComponent
  ],
  exports: [
    NNoteListComponent,
    NoteComponent
  ],
  providers: [
    ApiBaseService,
    DatePipe,
    MessageService,

    NoteService
  ]
})
export class NoteModule {
}
