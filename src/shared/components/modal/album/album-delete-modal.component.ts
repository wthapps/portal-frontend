import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({
  selector: 'album-delete-modal',
  templateUrl: 'album-delete-modal.component.html',
})
export class AlbumDeleteModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  selectedAlbums: Array<any> = new Array<any>();

  checked = false;

  open(options?: any) {
    this.selectedAlbums = options['selectedObjects'];
    this.modal.open();
  }

  close(options?: any) {
    this.modal.close();
  }

  onDelete(): void {
    this.event.emit({
      action: 'deleteMedia',
      payload: {selectedObjects: this.selectedAlbums, child_destroy: this.checked }});
    this.modal.close();

  }
}
