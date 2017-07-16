import { Component, Input, ViewChild, HostBinding, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { ProfileConfig } from '../profile-config.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-media',
  templateUrl: 'media.component.html'
})

export class PartialsProfileMediaComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

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

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
    this.form = fb.group({
      'medias': fb.array([
        this.initItem(),
      ])
    });
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
        category: [item.category, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    } else {
      return this.fb.group({
        category: ['', Validators.compose([Validators.required])],
        value: ['', Validators.compose([Validators.required, CustomValidator.urlFormat])]
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

    _.map(this.data.media, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    this.data.media = values.media;
    this.eventOut.emit(values);
    this.modal.close();
  }

  getMediaControls() {
    return (<FormGroup>(<FormGroup>this.form.get('medias')))['controls'];
  }
}
