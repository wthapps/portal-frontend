import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../validator/custom.validator';
import { ApiBaseService } from '../../../services/apibase.service';

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

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  mediaType: any = [
    {
      kind_of: 'facebook',
      name: 'Facebook'
    },
    {
      kind_of: 'google_plus',
      name: 'Google Plus'
    },
    {
      kind_of: 'twitter',
      name: 'Twitter'
    },
    {
      kind_of: 'linkedin',
      name: 'LinkedIn'
    },
    {
      kind_of: 'other',
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
        kind_of: [item.kind_of, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.urlFormat])]
      });
    } else {
      return this.fb.group({
        kind_of: ['', Validators.compose([Validators.required])],
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
    this.apiBaseService.put('zone/social_network/users/' + this.data.uuid, values).subscribe((res:any) => {
      this.removeAll();
      this.data = res.data;
      _.map(this.data.media, (v: any)=> {
        this.addItem(v);
      });
      this.modal.close();
    });
  }

  getMediaControls() {
    return (<FormGroup>(<FormGroup>this.form.get('medias')))['controls'];
  }
}
