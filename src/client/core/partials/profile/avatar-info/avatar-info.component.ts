import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { QuestionBase } from '../../form/base/question-base';
import { QuestionControlService } from '../../form/base/question-control.service';
import { TextboxQuestion } from '../../form/categories/textbox-question';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-avatar-info',
  templateUrl: 'avatar-info.component.html'
})

export class PartialsProfileAvatarInfoComponent implements OnInit {
  @Input() data: any;
  @Input() editable: boolean = true;
  @Input() nameOnly: boolean = false;
  @ViewChild('modal') modal: ModalComponent;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();


  form: FormGroup;
  questions: QuestionBase<any>[];

  constructor(private questionControlService: QuestionControlService) {

  }

  ngOnInit() {
    if (this.nameOnly) {
      this.questions = [
        new TextboxQuestion({
          key: 'name',
          label: 'Name',
          value: this.data.name,
          required: true
        })
      ];
    } else {
      this.questions = [
        new TextboxQuestion({
          key: 'first_name',
          label: 'First Name',
          value: this.data.first_name,
          required: true
        }),

        new TextboxQuestion({
          key: 'last_name',
          label: 'Last Name',
          value: this.data.last_name,
          required: true
        }),

        new TextboxQuestion({
          key: 'nickname',
          value: this.data.nickname,
          label: 'Nickname'
        }),
      ];
    }
    this.form = this.questionControlService.toFormGroup(this.questions);
  }

  onOpenModal() {
    if (this.data.name) {
      this.form.controls['name'].setValue(this.data.name);
    }
    if (this.data.first_name && this.data.last_name) {
      this.form.controls['first_name'].setValue(this.data.first_name);
      this.form.controls['last_name'].setValue(this.data.last_name);
    }
    if (this.data.nickname) {
      this.form.controls['last_name'].setValue(this.data.last_name);
    }
    this.modal.open();
  }


  onSubmit(values: any): void {
    console.log(this.form);
    if (values.name) {
      this.data.name = values.name;
    }

    if (values.first_name && values.last_name) {
      this.data.name = values.first_name + ' ' + values.last_name;
    }

    if (values.nickname) {
      this.data.nickname = values.nickname;
    }

    this.modal.close();
    this.eventOut.emit(values);
  }
}
