import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../../shared/services/note.service';
import { ZNoteEditModalComponent } from './note-edit-modal.component';

@Component({
  moduleId: module.id,
  selector: 'note-create',
  templateUrl: 'note-create.component.html'
})
export class ZNoteCreateComponent implements OnInit {
  @ViewChild('editModal') editModal: ZNoteEditModalComponent;
  data: any;

  constructor(private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.editModal.open();
  }
}
