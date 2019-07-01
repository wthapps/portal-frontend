import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({
  selector: 'w-storage-detail-modal',
  templateUrl: 'storage-detail-modal.component.html',
  styleUrls: ['storage-detail-modal.component.scss']
})

export class StorageDetailModalComponent {
  @ViewChild('modal') modal: BsModalComponent;

  storage: any;

  constructor() {
  }


  /**
   *
   * @param options: object
   * options: {
   *   storage: object // storage object
   * }
   */
  open(options?: any) {
    this.storage = options.storage;
    this.modal.open();

  }

  close(option?: any) {
    this.modal.close();
  }
}
