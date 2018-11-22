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
  cardType: string = 'public' || 'private';
  open(options: any): void {
    this.card = options.payload;
    this.cardType = options.cardType;
    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onEdit() {
    this.edit.emit({card: this.card, cardType: this.cardType});
  }

  onDelete() {
    this.delete.emit({card: this.card, cardType: this.cardType});
  }

  onExport() {
    this.export.emit({card: this.card, cardType: this.cardType});
  }
}
