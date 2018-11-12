import { Component, Input, ViewChild, HostBinding, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { ProfileFormMixin } from '../../../shared/mixins/form/profile/profile-form.mixin';
import { Mixins  } from '../../../design-patterns/decorator/mixin-decorator';

declare var _: any;

@Mixins([ProfileFormMixin])
@Component({
  selector: 'w-user-media',
  templateUrl: 'media-list.component.html'
})

export class MediaListComponent implements ProfileFormMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  deleteObjects: any = [];
  type: string = 'media';

  mediaType: any = [
    {
      category: 'facebook',
      name: 'Facebook'
    },
    {
      category: 'google_plus',
      name: 'Google Plus'
    },
    {
      category: 'twitter',
      name: 'Twitter'
    },
    {
      category: 'linkedin',
      name: 'LinkedIn'
    },
    {
      category: 'other',
      name: 'Other'
    },
  ];

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'media': fb.array([
        this.initItem(),
      ])
    });
  }

  //media
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        category: [item.category, Validators.compose([Validators.required])],
        id: [item.id, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    } else {
      return this.fb.group({
        category: ['facebook', Validators.compose([Validators.required])],
        value: ['', Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['media'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    _.map(this.data.media, (v: any)=> {
      this.addItem(v);
    });
    this.addItem();
  }
}
