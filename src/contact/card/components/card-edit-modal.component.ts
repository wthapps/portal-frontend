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
  cardName = 'untitled';

  card: any;
  cardType: string = 'public' || 'business';
  phoneType = Constants.phoneType;
  emailType = Constants.emailType;
  addressType = Constants.addressType;
  mediaType = Constants.mediaType;

  private mode: string = 'create' || 'edit';

  open(options: any): void {
    this.mode = options.mode;
    if (this.mode === 'edit') {
      this.card = options.card;
      this.selectedFields = this.card.public_fields;
    } else {
      this.selectedFields = ['name', 'profile_image'];
    }
    this.cardType = options.cardType;

    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onSave() {
    if (this.mode === 'create') {
      this.card = {
        card_type: 'business',
        name: this.profile.name,
        first_name: this.profile.first_name,
        last_name: this.profile.last_name,
        nickname: this.profile.nickname,
        email: this.profile.email,
        phone_number: this.profile.phone_number,
        link: this.profile.link,
        birthday: this.profile.birthday,
        sex: this.profile.sex,
        profile_image: this.profile.profile_image,
        cover_image: this.profile.cover_image,
        company: this.profile.company,
        occupation: this.profile.occupation,
        nationality: this.profile.nationality,
        public_fields: this.selectedFields,
      };
    }
    this.card.public_fields = this.selectedFields;
    this.card.card_name = this.cardName;
    this.save.emit({mode: this.mode, card: this.card});
  }

  onCancel() {
    this.cancel.emit(this.card);
    this.close();
  }
}
