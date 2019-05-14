import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'z-note-shared-modal-edit-name',
  templateUrl: 'edit.component.html'
})
export class ZNoteSharedModalEditNameComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  nameNote: string;
  permission: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.eventEmitter.unsubscribe();
  }

  onSave() {
    this.eventEmitter.emit(this.nameNote);
  }

  open(name: string, permission: string) {
    this.nameNote = name ? name : 'Untitled Note';
    this.permission = permission;
    this.modal.open();
  }
}
