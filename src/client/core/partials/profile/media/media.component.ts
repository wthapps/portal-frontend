import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-media',
  templateUrl: 'media.component.html'
})

export class PartialsProfileMediaComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;

  mediaType: any = [
    {
      type: 'facebook',
      name: 'Facebook'
    },
    {
      type: 'google_plus',
      name: 'Google Plus'
    },
    {
      type: 'twitter',
      name: 'Twitter'
    },
    {
      type: 'linkedin',
      name: 'LinkedIn'
    },
    {
      type: 'other',
      name: 'Other'
    },
  ];

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'medias': fb.array([
        this.initItem(),
      ])
    });

    console.log(this.form);
  }

  removeAll() {
    const control = <FormArray>this.form.controls['medias'];
    control.controls.length = 0;
    control.reset();
  }

  //medias
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        type: [item.type, Validators.compose([Validators.required])],
        media: [item.media, Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    } else {
      return this.fb.group({
        type: ['', Validators.compose([Validators.required])],
        media: ['', Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['medias'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['medias'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    console.log(values);
  }
}
