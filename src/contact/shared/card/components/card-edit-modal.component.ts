import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';


import { Constants } from '../../../../shared/constant';
import { PUBLIC, BUSINESS, UNTITILED, NONE } from '../card.constant';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

declare var $: any;

const BODY_MAX_HEIGHT = 430; // in px
@Component({
  selector: 'w-card-edit-modal',
  templateUrl: 'card-edit-modal.component.html',
  styleUrls: ['card-edit-modal.component.scss']
})
export class CardEditModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('modal') nameEl: ElementRef;

  @Input() profile: any;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  // selectedFields: string[] = [];
  // cardName = UNTITILED;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  company: AbstractControl;
  // groups: AbstractControl;
  occupation: AbstractControl;
  headline: AbstractControl;
  about: AbstractControl;
  card_name: AbstractControl;
  public_fields: AbstractControl;
  custom_fields: AbstractControl;
  showMore = true;

  focus = false;
  readonly cardType: string = PUBLIC || BUSINESS;
  readonly phoneType = Constants.phoneType;
  readonly emailType = Constants.emailType;
  readonly addressType = Constants.addressType;
  readonly mediaType = Constants.mediaType;
  readonly PUBLIC = PUBLIC;
  readonly BUSINESS = BUSINESS;
  readonly NONE = NONE;
  readonly SEX = Constants.sex;
  readonly READONLY_FIELDS = ['first_name', 'last_name', 'about'];

  readonly DEFAULT_CARD = {
    card_type: BUSINESS,
    card_name: UNTITILED,
    public_fields: ['name', 'profile_image'],
  };
  private mode: string = 'create' || 'edit';
  // private card: any;

  constructor(public countryService: CountryService,
      private fb: FormBuilder
    ) {
    this.createForm();
    this.enableShowMore();
  }

  open(options: any): void {
    this.mode = options.mode;
    const card = options.card || this.DEFAULT_CARD;
    this.updateForm(card);


    this.modal.open();
    this.focus = true;
  }

  updateForm(value) {
    // about is a special field: it can be edited in business card, but not in public card
    const formValue = value.card_type === this.PUBLIC ? {...value, about: this.profile.about} : value;
    this.form.patchValue(formValue);
  }

  createForm() {
    this.form = this.fb.group({
      'id': [''],
      'uuid': [''],
      'card_name': [this.DEFAULT_CARD.card_name],
      'card_type': [this.DEFAULT_CARD.card_type],
      'first_name': [''],
      'last_name': [''],
      'company': [''],
      'occupation': [''],
      'headline': [''],
      'about': [''],
      'public_fields': [this.DEFAULT_CARD.public_fields],
      'emails': [''],
      'phones': [''],
      'addresses': [''],
      'media': [''],
      'custom_fields': this.fb.array([
        this.fb.group({
          'label': [''],
          'value': ['']
          })
      ])
    });

    this.card_name = this.form.controls['card_name'];
    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.company = this.form.controls['company'];
    this.occupation = this.form.controls['occupation'];
    this.headline = this.form.controls['headline'];
    this.about = this.form.controls['about'];
    this.public_fields = this.form.controls['public_fields'];
    this.custom_fields = this.form.controls['custom_fields'];
  }

  // Add items to custom labels array
  addItem(item?) {
    const control = <FormArray> this.form.controls['custom_fields'];
    control.push(this.initItem(item));
  }

  // Init custom label
  initItem(item?): FormGroup {
    if (item ) {
      const { label, value} = item;
      return this.fb.group({
        label, value
      });
    } else
    return this.fb.group({
      label: '',
      value: ''
    });
  }

  close(): void {
    this.focus = false;
    this.modal.close();
  }

  enableShowMore() {
    this.showMore = true;
    // this.showMore = $('.card-edit-modal-body').height() > BODY_MAX_HEIGHT;
  }

  onToggleShowMore(showMore) {
    this.showMore = !showMore;
  }

  onSave() {
    let card = {};
    if (this.mode === 'create') {
      card = {
        card_type: 'business',
        card_name: this.card_name.value || UNTITILED,
        public_fields: this.public_fields.value,
      };
    }
    Object.assign(card, this.form.value);
    this.READONLY_FIELDS.forEach(f => delete card[f]);
    this.save.emit({mode: this.mode, card});

  }

  onCancel() {
    this.form.reset();
    this.close();
  }
}
