import { Component, ViewChild, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { Constants } from '../../../../core/shared/config/constants';
import { ZMediaSharingService } from '../../../../core/shared/components/photo/modal/sharing/sharing.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-sharing',
  templateUrl: 'sharing.component.html',
  styleUrls: ['sharing.component.css']
})

export class ZNoteSharedModalSharingComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  mode: number = 0;
  operation: any = {
    read: 0,
    edit: 2,
    editing: 20,
    create: 1,
    creating: 10,
    delete: 9,
    deleting: 90
  };

  contacts: any = [];
  sharedContacts: any = [];

  textContacts: Array<any> = [];
  filteredContacts: any = [];

  selectedContacts: any = [];
  removedContacts: any = [];
  hasChanged: boolean = false;

  contactTerm$ = new Subject<string>();

  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private mediaSharingService: ZMediaSharingService) {

    this.contactTerm$
      .debounceTime(Constants.searchDebounceTime)
      .distinctUntilChanged()
      .switchMap((term: any) => this.mediaSharingService.getContacts(term.query))
      .subscribe((res: any) => {
          this.filteredContacts = res['data'];
        }, (error: any)=> {
          console.log('error', error);
        }
      );

  }

  ngOnInit(): void {
  }

  open() {
    this.modal.open()
  }

  cancel() {
    // cancel removing items
    if (this.mode == this.operation.editing || this.mode == this.operation.deleting) {
      this.removedContacts = [];
      this.mode = this.operation.read;
      return;
    }
    this.modal.close().then();
  }

  onSubmit(value: any) {
    console.log(value);
  }



  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.setMode();
    console.log(this.selectedContacts);
  }

  save() {
    console.log('asfasdf');
  }

  private resetData() {
    this.mode = this.operation.read;
    this.hasChanged = false;
    this.removedContacts = [];
    this.selectedContacts = [];
    this.textContacts = [];
  }

  private setMode() {
    let count = this.removedContacts.length + this.selectedContacts.length;
    if (count == 0) {
      this.mode = this.operation.read;
    } else if (count > 0) {
      this.mode = this.sharedContacts.length == 0 ? this.operation.creating : this.operation.editing;
    }
    this.hasChanged = this.mode != this.operation.read ? true : false;
  }
}
