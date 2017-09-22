import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../../shared/services/note.service';
import { ZNoteEditModalComponent } from './note-edit-modal.component';

@Component({
  moduleId: module.id,
  selector: 'note-edit',
  templateUrl: 'note-edit.component.html'
})
export class ZNoteEditComponent implements OnInit {
  @ViewChild('editModal') editModal: ZNoteEditModalComponent;

  data: any;

  constructor(private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.editModal.open();
  }
}
