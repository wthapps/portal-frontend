// import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
// import { BsModalComponent } from 'ng2-bs3-modal';
//
// @Component({
//   selector: 'z-note-shared-modal-edit-name',
//   templateUrl: 'edit.component.html'
// })
//
// export class ZNoteSharedModalEditNameComponent {
//   @ViewChild('modal') modal: BsModalComponent;
//   @Input() name: string;
//   @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
//
//   onSave() {
//     this.eventEmitter.emit(this.name);
//   }
// }

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';

declare var _: any;

@Component({
  selector: 'z-note-shared-modal-edit-name',
  templateUrl: 'edit.component.html'
})
export class ZNoteSharedModalEditNameComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() name: string;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }


  ngOnInit() {

  }

  ngOnDestroy() {
    this.eventEmitter.unsubscribe();
  }

  onSave() {
    this.eventEmitter.emit(this.name);
  }
}