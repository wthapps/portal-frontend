import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { ApiBaseService } from '../../../services/apibase.service';
import { Constants } from '../../../constant/config/constants';
import { QuestionControlService } from '../../../shared/components/form/base/question-control.service';
import { ProfileFormMixin } from '../../../shared/mixins/form/profile/profile-form.mixin';
import { Mixins  } from '../../../design-patterns/decorator/mixin-decorator';

declare var _: any;

@Mixins([ProfileFormMixin])
@Component({
  selector: 'w-user-emails',
  templateUrl: 'email-list.component.html'
})

export class EmailListComponent implements OnInit, ProfileFormMixin {
  @Input() data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  deleteObjects: any = [];
  type = 'emails';

  emailType: any = Constants.emailType;

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService, private questionControlService: QuestionControlService) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      emails: this.fb.array([
        this.initItem(),
      ])
    });
  }

  // emails
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        category: [item.category, Validators.compose([Validators.required])],
        id: [item.id, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    } else {
      return this.fb.group({
        category: ['work', Validators.compose([Validators.required])],
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
    this.removeAll();
    if (this.data.emails && this.data.emails.length > 0) {
      this.data.emails.map(v => {
        this.addItem(v);
      });
    } else {
      this.addItem();
    }
  }

}
