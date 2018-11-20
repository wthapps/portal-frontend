import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
@Component({
  selector: 'w-card-edit-modal',
  templateUrl: 'card-edit-modal.component.html',
  styleUrls: ['card-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardEditModalComponent {
  @ViewChild('modal') modal: any;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  selectedValues: string[] = [];

  card: any;
  private mode: string = 'create' || 'edit';

  open(options: any): void {
    this.mode = options.mode;
    this.card = options.payload;
    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onSave() {
    this.save.emit(this.card);
    this.close();
  }

  onCancel() {
    this.cancel.emit(this.card);
    this.close();
  }
}
