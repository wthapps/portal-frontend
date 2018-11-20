import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
@Component({
  selector: 'w-card-detail-modal',
  templateUrl: 'card-detail-modal.component.html',
  styleUrls: ['card-detail-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardDetailModalComponent {
  @ViewChild('modal') modal: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();

  card: any;
  open(options: any): void {
    this.card = options.payload;
    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onEdit() {
    this.edit.emit(this.card);
  }

  onDelete() {
    this.delete.emit(this.card);
  }

  onExport() {
    this.export.emit(this.card);
  }
}
