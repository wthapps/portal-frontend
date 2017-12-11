import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../../shared/services/note.service';
import { NoteEditModalComponent } from '../../shared/modal/note/note-edit-modal.component';

@Component({
  selector: 'note-edit',
  templateUrl: 'note-edit.component.html'
})
export class ZNoteEditComponent implements OnInit {
  @ViewChild('modal') modal: NoteEditModalComponent;

  data: any;

  constructor(private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.modal.open();
  }
}
