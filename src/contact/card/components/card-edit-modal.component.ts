import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
@Component({
  selector: 'w-card-edit-modal',
  templateUrl: 'card-edit-modal.component.html',
  styleUrls: ['card-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardEditModalComponent {
  @ViewChild('modal') modal: any;
  @Input() profile: any;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  selectedFields: string[] = [];

  card: any;
  cardType: string = 'public' || 'private';
  phoneType = Constants.phoneType;
  emailType = Constants.emailType;
  addressType = Constants.addressType;
  mediaType = Constants.mediaType;

  private mode: string = 'create' || 'edit';

  open(options: any): void {
    this.mode = options.mode;
    this.card = options.card;
    this.cardType = options.cardType;
    this.selectedFields = this.card.public_fields;
    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onSave() {
    this.card.public_fields = this.selectedFields;
    this.save.emit({mode: this.mode, card: this.card});
  }

  onCancel() {
    this.cancel.emit(this.card);
    this.close();
  }
}
