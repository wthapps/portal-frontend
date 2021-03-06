import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { PartialsProfileService } from '../profile.service';
import { Mixins  } from '../../../../design-patterns/decorator/mixin-decorator';
import { ProfileFormMixin } from '../../../mixins/form/profile/profile-form.mixin';
import { ProfileFormCustomSubmitMixin } from '../../../mixins/form/profile/profile-form-custom-submit.mixin';

declare var _: any;

@Mixins([ProfileFormMixin, ProfileFormCustomSubmitMixin])
@Component({
  selector: 'partials-profile-hobby',
  templateUrl: 'hobby.component.html'
})

export class PartialsProfileHobbyComponent implements ProfileFormMixin, ProfileFormCustomSubmitMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  deleteObjects: any = [];
  type: string = 'hobbies';

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;
  onCustomSubmit: (values: any) => void;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService) {
    this.form = fb.group({
      'hobbies': fb.array([
        this.initItem(),
      ])
    });
  }

  //hobbys
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        title: [item.title],
        description: [item.description]
      });
    } else {
      return this.fb.group({
        title: [''],
        description: ['']
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['hobbies'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    _.map(this.data.hobbies, (v: any)=> {
      this.addItem(v);
    });
    this.addItem();
  }
}
