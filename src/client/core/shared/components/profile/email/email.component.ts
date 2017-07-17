import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../validator/custom.validator';
import { ApiBaseService } from '../../../services/apibase.service';
import { Constants } from '../../../config/constants';
import { ProfileConfig } from '../profile-config.model';
import { QuestionBase } from '../../form/base/question-base';
import { TextboxQuestion } from '../../form/categories/textbox-question';
import { QuestionControlService } from '../../form/base/question-control.service';
import { DropdownQuestion } from '../../form/categories/dropdown-question';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-email',
  templateUrl: 'email.component.html'
})

export class PartialsProfileEmailComponent implements OnInit{
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  questions: QuestionBase<any>[];
  form: FormGroup;

  emailType: any = Constants.emailType;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService, private questionControlService: QuestionControlService) {

  }


  ngOnInit() {
    this.form = this.fb.group({
      'emails': this.fb.array([
        this.initItem(),
      ])
    });
  }

  removeAll() {
    const control = <FormArray>this.form.controls['emails'];
    control.controls.length = 0;
    control.reset();
  }

  //emails
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        category: [item.category, Validators.compose([Validators.required])],
        id: [item.id, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    } else {
      return this.fb.group({
        category: ['', Validators.compose([Validators.required])],
        value: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['emails'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['emails'];
    this.eventOut.emit({action: 'delete', item: 'emails', data: control.at(i).value});
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data.emails, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    // if (this.config.callApiAfterChange) {
    //
    //   let urlApi = (this.config.onEditCustomUrl ? this.config.onEditCustomUrl : 'zone/social_network/users');
    //
    //   this.apiBaseService.put(`${urlApi}/` + this.data.uuid, values).subscribe((res: any) => {
    //     this.removeAll();
    //     this.data = res.data;
    //     _.map(this.data.emails, (v: any)=> {
    //       this.addItem(v);
    //     });
    //   });
    //
    //
    // } else {
    //   this.data.emails = values.emails;
    // }
    this.data.emails = values.emails;
    this.eventOut.emit({action: 'update', item: 'email', data: values});
    this.modal.close();
  }

  getEmailControls() {
    return (<FormGroup>(<FormGroup>this.form.get('emails')))['controls'];
  }
}
