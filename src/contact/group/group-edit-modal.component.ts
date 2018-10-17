import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
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

declare var $: any;

const DUPLICATE_GROUP_NAME =  'This group name already exists.';
const REQUIRED_NAME = 'Name is required';
@Component({
  selector: 'group-edit-modal',
  templateUrl: 'group-edit-modal.component.html',
  styleUrls: ['group-edit-modal.component.scss']
})
export class GroupEditModalComponent implements OnInit, WthAppsBaseModal {
  @Input() mode: string;
  @Input() item: Group;

  @ViewChild('modal') modal: BsModalComponent;
  event: any;
  titleName: string;

  form: FormGroup;
  name: AbstractControl;
  errMsg: string;


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
      name: [this.item.name, Validators.compose([Validators.required])]
    });
    this.name = this.form.controls['name'];
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

    console.log('grouplll', this.item);

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }
}
