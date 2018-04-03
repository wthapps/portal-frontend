import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

declare var $: any;

@Component({
  moduleId: module.id,
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

  constructor(private fb: FormBuilder, private groupService: GroupService) {}

  ngOnInit() {
    this.titleName = this.mode == 'edit' ? 'Edit Group' : 'New Group';

    this.form = this.fb.group({
      id: [this.item.id],
      name: [this.item.name, Validators.compose([Validators.required])]
    });
    this.name = this.form.controls['name'];
  }

  submit() {
    if (this.mode == 'edit') {
      this.groupService.update(this.form.value).toPromise();
    } else {
      this.groupService.create(this.form.value).toPromise();
    }
    this.modal.close().then();
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
