import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-hobby',
  templateUrl: 'hobby.component.html'
})

export class PartialsProfileHobbyComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService) {
    this.form = fb.group({
      'hobbies': fb.array([
        this.initItem(),
      ])
    });
  }

  removeAll() {
    const control = <FormArray>this.form.controls['hobbies'];
    control.controls.length = 0;
    control.reset();
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

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['hobbies'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data.hobbies, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    this.data.hobbies = values.hobbies;
    this.eventOut.emit(values);
    this.modal.close();
  }

  getHobbyControls() {
    return (<FormGroup>(<FormGroup>this.form.get('hobbies')))['controls'];
  }
}
