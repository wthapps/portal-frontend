import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';


import { ApiBaseService, CommonEventService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { ModalComponent } from '@shared/shared/components/base/components';
import { SharingModalConfig } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { SharingModalV1Service } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.service';
declare var $: any;
declare var _: any;

@Component({
  selector: 'sharing-modal-v1',
  templateUrl: 'sharing-modal-v1.component.html',
  styleUrls: ['sharing-modal-v1.component.scss']
})
export class SharingModalV1Component implements OnInit, OnDestroy, ModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  filteredContacts: any = [];
  selectedContacts: any = [];
  sharedContacts: any = [];
  role: any = {name: 'view'};
  roles: any = [];
  hasChanged: boolean;
  deleting: boolean;
  textContacts = [];

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();


  constructor(private apiBaseService: ApiBaseService, private sharingModalService: SharingModalV1Service) {
  }

  ngOnInit(){
    this.sharingModalService.onOpen$.subscribe(e => {
      this.open(e);
    });
  }

  ngOnDestroy() {}

  close() {
    this.modal.close().then();
  }

  save() {
    const data = {selectedContacts: this.selectedContacts, role: this.role};
    // short distance
    this.onSave.emit(data);
    // long distance
    this.sharingModalService.save.next(data);
    this.modal.close().then();
  }

  open(config?: SharingModalConfig) {
    this.getRoles();
    this.modal.open().then();
  }

  complete(e: any) {
    let body: any;
    body = {'q': (e.query === 'undefined' ? '' : 'name:' + e.query)};
    this.apiBaseService.get('media/sharings/recipients', body).subscribe(res => {
      const selectedContactIds = this.selectedContacts.map(ct => ct.id);
      const sharedContactIds = this.sharedContacts.map(sc => sc.id);
      this.filteredContacts = res['data'].filter(ct => !selectedContactIds.includes(ct.id) && !sharedContactIds.includes(ct.id));
    });
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.hasChanged = true;
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.hasChanged = true;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
      this.role = this.roles[0];
    });
  }

  changeRole(e: any) {
    this.role = e;
  }
}
