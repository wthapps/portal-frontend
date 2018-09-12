import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';

declare var _: any;

@Component({
  selector: 'long-message-modal',
  templateUrl: 'long-message-modal.component.html'
})
export class LongMessageModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  title = 'Your message is too long';
  body = 'The maximum limit for a message is 2000 characters. Please make your message shorter.'

  constructor() {}


  ngOnInit() {
  }

  open() {
    this.modal.open();
  }

  ngOnDestroy() {
  }
}
