import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({
  selector: 'w-storage-upgrade-modal',
  templateUrl: 'storage-upgrade-modal.component.html'
})

export class StorageUpgradeModalComponent {
  @ViewChild('modal') modal: BsModalComponent;

  val1: any;
  constructor() {
  }

  open(options?: any) {
    this.modal.open();
  }

  close(options?: any) {
    this.modal.close();
  }
}
