import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';



declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'invitation-create-modal',
  templateUrl: 'invitation-create-modal.component.html'
})

export class InvitationCreateModalComponent implements OnInit {
  @Input('data') data: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modal') modal: ModalComponent;

  constructor() {

  }

  ngOnInit() {

  }

  open(options?: any) {
    this.data = options.data;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'done':
        this.event.emit(event);
        break;
      case 'cancel':
        this.modal.close(null).then();
        break;
    }
  }

}
