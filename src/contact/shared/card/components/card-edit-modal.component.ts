import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef, AfterViewInit
} from '@angular/core';

import { Observable, from, of, interval } from 'rxjs';

import { Constants } from '../../../../shared/constant';
import { PUBLIC, BUSINESS, UNTITILED, NONE } from '../card.constant';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({
  selector: 'w-card-edit-modal',
  templateUrl: 'card-edit-modal.component.html',
  styleUrls: ['card-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardEditModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('modal') nameEl: ElementRef;

  @Input() profile: any;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  selectedFields: string[] = [];
  cardName = UNTITILED;

  card: any;
  cardType: string = PUBLIC || BUSINESS;
  phoneType = Constants.phoneType;
  emailType = Constants.emailType;
  addressType = Constants.addressType;
  mediaType = Constants.mediaType;
  focus = false;
  readonly PUBLIC = PUBLIC;
  readonly BUSINESS = BUSINESS;
  readonly NONE = NONE;
  readonly SEX = Constants.sex;

  readonly DEFAULT_CARD = {
    card_type: BUSINESS,
    card_name: UNTITILED,
    public_fields: ['name', 'profile_image'],
  };
  private mode: string = 'create' || 'edit';

  constructor(private countryService: CountryService) {}


  open(options: any): void {
    this.mode = options.mode;
    this.card = options.card || this.DEFAULT_CARD;
    this.selectedFields = this.card.public_fields;
    this.cardName = this.card.card_name;
    this.modal.open();
    this.focus = true;
  }

  close(): void {
    this.focus = false;
    this.modal.close();
  }

  onSave() {
    if (this.mode === 'create') {
      this.card = {
        card_type: 'business',
        card_name: '',
        public_fields: this.selectedFields,
      };
    }
    this.card.public_fields = this.selectedFields;
    this.card.card_name = this.cardName.toString().trim() === '' ? UNTITILED : this.cardName.toString().trim();
    this.save.emit({mode: this.mode, card: this.card});
  }

  onCancel() {
    this.cancel.emit(this.card);
    this.close();
  }

  getCountry(code: string): Observable<any> {
    return this.countryService.getCountry(code);
  }

  hasChange(card): Observable<boolean> {
    if (!card) {
      return of(true);
    }
    return of((this.selectedFields.toString() !== card.public_fields.toString()) || (this.cardName !== card.card_name));
  }
}
