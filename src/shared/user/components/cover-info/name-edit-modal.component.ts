import { Component, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { Subject } from 'rxjs';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { WModalService } from '@shared/modal/w-modal-service';

@Component({
  selector: 'w-user-name-modal',
  templateUrl: 'name-edit-modal.component.html',
})
export class NameEditModalComponent {
  @Input() user: any;
  @Input() editable = true;
  @Input() nameOnly = false;
  @ViewChild('modal') modal: any;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  destroySubject: Subject<any> = new Subject<any>();

  userForm: FormGroup;

  first_name: AbstractControl;
  last_name: AbstractControl;
  nickname: AbstractControl;
  company: AbstractControl;
  occupation: AbstractControl;
  headline: AbstractControl;

  constructor(
    private fb: FormBuilder,
    private modalService: WModalService,
    ) {
      this.userForm = this.fb.group({
        first_name: ['', [Validators.required, Validators.maxLength(50), CustomValidator.blanked]],
        last_name: ['', [Validators.required, Validators.maxLength(50), CustomValidator.blanked]],
        nickname: ['', [Validators.maxLength(50)]],
        company: [''],
        occupation: [''],
        headline: [''],
      });

      this.first_name = this.userForm.controls['first_name'];
      this.last_name = this.userForm.controls['last_name'];
      this.nickname = this.userForm.controls['nickname'];
      this.company = this.userForm.controls['company'];
      this.occupation = this.userForm.controls['occupation'];
      this.headline = this.userForm.controls['headline'];

    }

  open(payload?: any) {
    if (payload && payload.user) {
      this.user = payload.user;
    }
    // this.userForm = this.createUserForm(this.user, this.nameOnly);
    this.updateForm(this.user, this.nameOnly);
    this.modal.open();
    this.modal.element.nativeElement.style.display = 'inline';
  }

  close(payload?: any) {
    this.modalService.close(payload);
    this.modal.close();
  }

  onSubmit(payload?: any): void {
    this.modalService.submit(payload);
    this.modal.close();
  }

  updateForm(formValue, nameOnly?: boolean) {
    const value = nameOnly ? {first_name: formValue.first_name, last_name: formValue.last_name} : formValue;
    this.userForm.patchValue(value);
  }

}
