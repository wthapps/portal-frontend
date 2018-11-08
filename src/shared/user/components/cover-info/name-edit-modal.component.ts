import { Component, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  userForm = this.fb.group({
    first_name: ['', [Validators.required, CustomValidator.blanked]],
    last_name: ['', [Validators.required, CustomValidator.blanked]],
    nickname: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: WModalService,
    ) {  }



  open(payload?: any) {
    if (payload && payload.user) {
      this.user = payload.user;
    }
    this.userForm = this.createUserForm(this.user, this.nameOnly);
    this.modal.open();
    this.modal.element.nativeElement.style.display = 'inline';
  }

  close(payload?: any) {
    this.modalService.close(payload);
    this.modal.close();
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(payload?: any): void {
    this.modalService.submit(payload);
    this.modal.close();
  }


  private createUserForm(user: any, nameOnly?: boolean): FormGroup {
    if (nameOnly) {
      return this.fb.group({
        first_name: [user.first_name, [Validators.required, CustomValidator.blanked]],
        last_name: [user.last_name, [Validators.required, CustomValidator.blanked]],
      });
    } else {
      return this.fb.group({
        first_name: [user.first_name, [Validators.required, CustomValidator.blanked]],
        last_name: [user.last_name, [Validators.required, CustomValidator.blanked]],
        nickname: [''],
      });
    }
  }

}
