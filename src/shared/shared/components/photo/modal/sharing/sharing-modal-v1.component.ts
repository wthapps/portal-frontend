import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';


import { ApiBaseService, CommonEventService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ModalComponent } from '@shared/shared/components/base/components';
declare var $: any;
declare var _: any;

interface SharingModalConfig {
  isNew: boolean;
}

@Component({
  selector: 'sharing-modal-v1',
  templateUrl: 'sharing-modal-v1.component.html',
  styleUrls: ['sharing-modal-v1.component.scss']
})
export class SharingModalV1Component implements OnDestroy, ModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  filteredContacts: any = [];
  selectedContacts: any = [];
  sharedContacts: any = [];
  role: any = {name: 'view'};
  roles: any = [];

  constructor(private apiBaseService: ApiBaseService) {
  }

  ngOnDestroy() {}

  init(config: SharingModalConfig) {
    this.getRoles();
  }

  close() {
    this.modal.close();
  }

  save() {
    this.modal.close();
  }

  open() {
    this.modal.open();
  }

  complete(e: any) {
    let body: any;
    body = {'q': (e.query === 'undefined' ? '' : 'name:' + e.query)};
    this.apiBaseService.get('media/sharings/recipients', body).subscribe(res => {
      const selectedContactIds = this.selectedContacts.map(ct => ct.id);
      const sharedContactIds = this.sharedContacts.map(sc => sc.id);
      this.filteredContacts = res['data'].filter(ct => !selectedContactIds.includes(ct.id) && !sharedContactIds.includes(ct.id));
    })
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
    });
  }
}
