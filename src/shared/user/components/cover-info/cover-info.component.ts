import { Component, OnInit, Input, ViewEncapsulation, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { LoadingService } from '../../../shared/components/loading/loading.service';
import { ApiBaseService } from '../../../services/apibase.service';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { WModalService } from '@shared/modal/w-modal-service';


@Component({
  selector: 'w-user-cover-info',
  templateUrl: 'cover-info.component.html',
  styleUrls: ['cover-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoverInfoComponent implements OnDestroy {
  @Input() user: any;
  @Input() editable = true;
  @Input() nameOnly = false;
  @ViewChild('modal') modal: BsModalComponent;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeAvatar: EventEmitter<any> = new EventEmitter<any>();


  destroySubject: Subject<any> = new Subject<any>();

  userForm = this.fb.group({
    firstName: ['', [Validators.required, CustomValidator.blanked]],
    lastName: ['', [Validators.required, CustomValidator.blanked]],
    nickName: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: WModalService,
    private commonEventService: CommonEventService
    ) {

    }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  openModal() {
    this.onOpenModal.emit({modalName: 'NameEditModal', user: this.user});
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(values: any): void {

  }

  changeProfileImage(event: any): void {
    this.onChangeAvatar.emit(this.user);
  }

  private createUserForm(nameOnly: boolean): FormGroup {
    if (nameOnly) {
      return this.fb.group({
        firstName: ['', [Validators.required, CustomValidator.blanked]],
        lastName: ['', [Validators.required, CustomValidator.blanked]],
      });
    } else {
      return this.fb.group({
        firstName: ['', [Validators.required, CustomValidator.blanked]],
        lastName: ['', [Validators.required, CustomValidator.blanked]],
        nickName: [''],
      });
    }
  }


}
