import { CustomValidator } from './../../shared/shared/validator/custom.validator';
import { Component, Input, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';

import { WthAppsBaseModal } from '../../shared/shared/interfaces/wthapps-base-modal';
import { Group } from './group.model';
import { GroupService } from './group.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from '@shared/constant';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

declare var $: any;

const DUPLICATE_GROUP_NAME =  'This group name already exists.';
const REQUIRED_NAME = 'No valid name is entered';
@Component({
  selector: 'group-edit-modal',
  templateUrl: 'group-edit-modal.component.html',
  styleUrls: ['group-edit-modal.component.scss']
})
export class GroupEditModalComponent implements OnInit, OnDestroy, WthAppsBaseModal {
  @Input() mode: string;
  @Input() item: Group;

  @ViewChild('modal') modal: BsModalComponent;
  event: any;
  titleName: string;

  form: FormGroup;
  name: AbstractControl;
  errMsg: string;
  private destroySubject: Subject<any> = new Subject();


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (ke.keyCode === 13) {
      this.submit();
    }
  }

  constructor(private fb: FormBuilder, private groupService: GroupService) {}

  ngOnInit() {
    this.titleName = this.mode === 'edit' ? 'Edit Group' : 'New Group';

    this.form = this.fb.group({
      id: [this.item.id],
      name: [this.item.name, Validators.compose([Validators.required, CustomValidator.notEmpty])]
    });
    this.name = this.form.controls['name'];

    this.form.valueChanges.pipe(
      takeUntil(this.destroySubject))
      .subscribe(val => {
        console.log(val);
        const { name } = val;
        if (!name) {
          this.errMsg = null;
          return;
        }
        this.errMsg = null;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  submit() {
    const { name, ...rest } = this.form.value;
    const trimedName = name ? name.trim() : '';
    this.errMsg = null;
    if (trimedName === '') {
      console.warn(REQUIRED_NAME, trimedName);
      this.errMsg = REQUIRED_NAME;
      return;
    }
    if (this.mode === 'edit') {
      this.groupService.update({name: trimedName, ...rest})
      .subscribe(() => this.modal.close(),
      (err: HttpErrorResponse) => {
        if (err.status === Constants.HttpStatusCode.NotAcceptable)
          this.errMsg = DUPLICATE_GROUP_NAME;
      })
      ;
    } else {
      this.groupService.create({name: trimedName, ...rest})
      .subscribe(() => this.modal.close(),
      (err: HttpErrorResponse) => {
        if (err.status === Constants.HttpStatusCode.NotAcceptable)
          this.errMsg = DUPLICATE_GROUP_NAME;
      })
      ;
    }
  }

  open(options?: any) {
    this.mode = options.mode || 'add';
    this.item = options.item || new Group();

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }
}
