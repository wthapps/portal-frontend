import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { WthAppsBaseModal } from '../../../../shared/shared/interfaces/wthapps-base-modal';
import { CommonEventService } from '../../../../shared/services/common-event/common-event.service';
import { GroupService } from '../../../group/group.service';
import { Constants } from '../../../../shared/constant/config/constants';
import { Group } from '@contacts/group/group.model';
import { Contact } from '@contacts/contact/contact.model';

declare var $: any;
declare var _: any;

@Component({
  selector: 'contact-add-group-modal',
  templateUrl: 'contact-add-group-modal.component.html',
  styleUrls: ['contact-add-group-modal.component.scss']
})

export class ContactAddGroupModalComponent implements OnInit, WthAppsBaseModal {
  @Input() mode: string;
  @Input() contacts: Contact[];

  @ViewChild('modal') modal: BsModalComponent;
    event: any;
  titleIcon: string;

  form: FormGroup;
  groupsCtrl: AbstractControl;
  originalGroups: Array<Group> = new Array<Group>();
  selectedGroupIds: Array<number> = [];
  inputGroups: Array<Group> = [];
  groups$: Observable<Group[]>;

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService,
   private groupService: GroupService)  {
    this.groups$ = this.groupService.getAllGroupsAsync();
  }

  ngOnInit() {
  }

  submit() {
    // if (this.contacts.length > 1) {
    //   _.forEach(this.contacts, (contact: any) => {
    //     // contact.groups = _.unionBy(this.getSelectedGroups(), 'id');
    //     contact.groups = this.selectedGroups;
    //   });
    // } else {
    //   // this.contacts[0].groups = _.unionBy(this.getSelectedGroups(), 'id');
    // }
    console.log(this.originalGroups, this.selectedGroupIds);
    const selectedGroups: Group[] = this.originalGroups.filter((gr: Group) => this.selectedGroupIds.includes(+gr.id));

    this.contacts.forEach((contact: any) => {
      const systemGroups = contact.groups.filter(gr => gr.system);
      contact.groups = selectedGroups.concat(systemGroups);
    });

    this.commonEventService.broadcast({
      channel: Constants.contactEvents.common,
      action: 'contact:contact:update',
      payload: {selectedObjects: this.contacts}}
    );
    this.modal.close().then();
  }

  open(options?: any) {
    this.mode = options.mode || 'add';
    this.contacts = options.contacts || null;
    this.inputGroups = options.groups || [];
    this.selectedGroupIds =  this.inputGroups.map(ig => ig.id);
    this.modal.open(options).then(() => {
    this.groupService.getAllGroups().then((groups: any[]) => {
      this.originalGroups = groups.filter(gr => !gr.system);
    });
    });
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  removeTag(event: any) {
    console.log('inside removeTag');
  }

  addTag(event: any) {
    console.log('inside addTag');}

}
