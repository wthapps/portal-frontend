import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { WthAppsBaseModal } from '../../../../shared/shared/interfaces/wthapps-base-modal';
import { CommonEventService } from '../../../../shared/services/common-event/common-event.service';
import { GroupService } from '../../../group/group.service';
import { Constants } from '../../../../shared/constant/config/constants';

declare var $: any;
declare var _: any;

@Component({
  selector: 'contact-add-group-modal',
  templateUrl: 'contact-add-group-modal.component.html',
  styleUrls: ['contact-add-group-modal.component.scss']
})

export class ContactAddGroupModalComponent implements OnInit, WthAppsBaseModal {
  @Input() mode: string;
  @Input() contacts: any;

  @ViewChild('modal') modal: ModalComponent;
  event: any;
  titleIcon: string;

  form: FormGroup;
  groupsCtrl: AbstractControl;
  groups: Array<string> = new Array<string>();
  originalGroups: Array<any> = new Array<any>();
  selectedGroups: Array<any> = [];
  inputGroups: Array<any> = [];

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService,
   private groupService: GroupService)  {

  }

  ngOnInit() {
    this.form = this.fb.group({
      'groups': [this.selectedGroups],
    });
    this.groupsCtrl = this.form.controls['groups'];
  }

  submit() {
    if (this.contacts.length > 1) {
      _.forEach(this.contacts, (contact: any) => {
        // contact.groups = _.unionBy(_.concat(contact.groups, this.getSelectedGroups()), 'id');
        contact.groups = _.unionBy(this.getSelectedGroups(), 'id');
      });
    } else {
      this.contacts[0].groups = _.unionBy(this.getSelectedGroups(), 'id');
    }
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
    this.selectedGroups = [];
    _.forEach(this.inputGroups, (group: any) => {
      this.selectedGroups.push({value: group.name, display: group.name});
    });
    this.modal.open(options).then(() => {
      this.groupService.getAllGroups().then((groups: any[]) => {
        this.originalGroups = groups.filter(gr => !gr.system);
        this.groups = _.map(this.originalGroups, 'name');
      });
    });
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  validData(): boolean {
    let result: boolean = true;
    if (this.selectedGroups.length == 0 && this.inputGroups.length == 0) {
      return false;
    }

    if(this.selectedGroups.length == this.inputGroups.length) {
      _.forEach(this.inputGroups, (l: any) => {
        _.forEach(this.selectedGroups, (sl: any) => {
          if (sl.value !== l.name) {
            result = false;
            return;
          }
        });
      });
    }
    return result;
  }

  removeTag(event: any) {
    console.log('inside removeTag');
  }

  addTag(event: any) {
    console.log('inside addTag');}

  private getSelectedGroups(): Array<any> {
    let result: Array<any> = new Array<any>();

    _.forEach(this.selectedGroups, (group: any) => {
      result.push(_.find(this.originalGroups, {name: group.value}));
    });
    return result;
  }

}
