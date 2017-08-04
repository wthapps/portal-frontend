import { Component, OnInit, ViewChild, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaSharingService } from './sharing.service';
import { Constants } from '../../../../config/constants';
import { WthAppsBaseModal } from '../../../../interfaces/wthapps-base-modal';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'sharing-modal',
  templateUrl: 'sharing-modal.component.html',
  styleUrls: ['sharing-modal.component.css']
})
export class SharingModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @Input() selectedItems: any = [];
  @Input() type: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  mode: number = 0;
  operation: any = {
    read: 0,
    edit: 2,
    editing: 20,
    create: 1,
    creating: 10,
    delete: 9,
    deleting:90
  };


  contacts: any = [];
  contactGroups: any = [];
  sharedContacts: any = [];

  textContacts: Array<any> = [];
  filteredContacts: any = [];

  selectedContacts: any = [];
  removedContacts: any = [];
  hasChanged: boolean = false;

  contactTerm$ = new Subject<string>();

  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(private mediaSharingService: ZMediaSharingService) {

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

  ngOnInit() {

  }

  ngOnDestroy() {
    this.contactTerm$.unsubscribe();
  }

  open(options: any) {
    this.selectedItems = options['selectedObjects'];
    this.modal.open(options).then((res: any) => this.getShared());
  }

  close(options?: any) {
    this.modal.close().then();
  }

  getShared() {
    let body = { objects: _.map(this.selectedItems, 'id') };

    this.mediaSharingService.getShared(body).take(1).subscribe((response: any)=> {
      this.sharedContacts = response.data;
    });
  }

  toggleRemoving(event: any, id: number) {
    event.preventDefault();
    let index = this.removedContacts.indexOf(id);
    if (index != -1) {
      this.removedContacts.splice(index, 1);
    } else {
      this.removedContacts.push(id);
    }

    this.setMode();
  }

  isDeletedItem(id: number): boolean {
    return this.removedContacts.indexOf(id) >= 0 ? true : false;
  }

  save() {

    // create new sharing with selected contacts
    if(this.mode == this.operation.creating) {
      let body = {
        objects: _.map(this.selectedItems, (item: any) => { return {id: item.id, object_type: item.object_type} }),
        recipients: _.map(this.selectedContacts, 'id')
      };

      // Only subscribe to this action once`
      this.mediaSharingService.add(body).take(1).subscribe((response: any) => {
          this.sharedContacts = this.selectedContacts;
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
        },
        (error: any) => {
          console.log('error', error);
        });
    }

    if (this.mode == this.operation.editing) {

      let body = {
        multiple: true,
        objects: _.map(this.selectedItems, 'id'),
        recipients: _.xor(_.concat(_.map(this.sharedContacts, 'id'),
          _.map(this.selectedContacts, 'id')), this.removedContacts)
      };

      this.mediaSharingService.update(body).take(1).subscribe((response: any) => {
          this.sharedContacts = response.data;
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
        },
        (error: any) => {
          console.log('error', error);
        });
    }

    if (this.mode == this.operation.read) {
      this.modal.close().then(() =>
        console.log('Item shared')
      );
    }
  }

  // Update sharing info for selected items
  updateSelectedItems(properties: any) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (!_.isEmpty(this.selectedItems[i].json_shares)) {
        _.extend(this.selectedItems[i].json_shares, properties);
      } else {
        this.selectedItems[i].json_shares = properties;
      }
    }
  }

  cancel() {
    // cancel removing items
    if (this.mode == this.operation.editing || this.mode == this.operation.deleting){
      this.removedContacts = [];
      this.mode = this.operation.read;
      return;
    }
    this.modal.close().then();
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.setMode();
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.setMode();
  }

  searchContact(event: any) {
    this.filteredContacts = _.filter(this.contacts,
      (c: any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  private resetData() {
    this.mode = this.operation.read;
    this.hasChanged = false;
    this.removedContacts = [];
    this.selectedContacts = [];
    this.textContacts = [];
  }

  private setMode() {
    let count = this.removedContacts.length +this.selectedContacts.length;
    if (count == 0) {
      this.mode = this.operation.read;
    }
    else if (count > 0) {
      this.mode = this.sharedContacts.length == 0 ? this.operation.creating : this.operation.editing;
    }
    this.hasChanged = this.mode != this.operation.read ? true: false;
  }

}
