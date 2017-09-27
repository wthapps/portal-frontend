import { Component, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Note } from '../../../../core/shared/models/note.model';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-note-view',
  templateUrl: 'view.component.html',
  styleUrls: ['note-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteSharedModalNoteViewComponent {
  @ViewChild('modal') modal: ModalComponent;
  @Input() data: Note;


  constructor() {
  }

  open() {
    this.modal.open()
  }
}
