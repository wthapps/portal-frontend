import { Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChild } from '@angular/core';
@Component({
  selector: 'w-card-detail-modal',
  templateUrl: 'card-detail-modal.component.html',
  styleUrls: ['card-detail-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardDetailModalComponent {
  @ViewChild('modal') modal: any;
  @Input() card: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();

  cardType: string = 'public' || 'business';
  open(options: any): void {
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
