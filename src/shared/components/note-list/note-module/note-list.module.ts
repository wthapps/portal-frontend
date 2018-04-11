import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSharedModule } from '@shared/angular-shared.module';
import { NoteListComponent } from '@notes/shared/list/note-list.component';

@NgModule({
  imports: [CommonModule, AngularSharedModule],
  declarations: [NoteListComponent],
  exports: [NoteListComponent]
})
export class NoteListModule {}
