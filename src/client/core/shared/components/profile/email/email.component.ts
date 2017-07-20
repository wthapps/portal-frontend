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
import { QuestionBase } from '../../form/base/question-base';
import { TextboxQuestion } from '../../form/categories/textbox-question';
import { QuestionControlService } from '../../form/base/question-control.service';
import { DropdownQuestion } from '../../form/categories/dropdown-question';
import { ProfileFormMixin } from '../../../mixins/form/profile/profile-form.mixin';
import { Mixin } from '../../../../design-patterns/decorator/mixin-decorator';

declare var _: any;

@Mixin([ProfileFormMixin])
@Component({
  moduleId: module.id,
  selector: 'partials-profile-email',
  templateUrl: 'email.component.html'
})

export class PartialsProfileEmailComponent implements OnInit, ProfileFormMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  deleteObjects: any = [];
  type: string = "emails";

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

  removeItem:(i: number) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

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

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data.emails, (v: any)=> {
      _this.addItem(v);
    });
  }
}
