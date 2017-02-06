import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ZMediaSharingService } from './sharing.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-sharing',
  templateUrl: 'sharing.component.html'
})
export class ZMediaSharingComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Input() selectedItems: any = [];

  contacts: any = [];
  contactGroups: any = [];
  sharedContacts: any = [];
  sharedContactGroups: any = [];

  textContacts: string = '';
  textContactGroups: string = '';
  filteredContacts: any = [];
  filteredContactGroups: any = [];

  selectedContacts: any = [];
  selectedContactGroups: any = [];

  hasDeletedItems: boolean = false;
  hasUpdatedItems: boolean = false;

  removedContacts: any = [];
  removedContactGroups: any = [];

  constructor(private mediaSharingService: ZMediaSharingService) {
  }

  ngOnInit() {
    this.getContacts();
    this.getContactGroups();
  }

  getShared() {
    let body = JSON.stringify({photos: _.map(this.selectedItems, 'id'), albums: []});
    this.mediaSharingService.getShared(body).subscribe((res: any)=> {
      this.sharedContacts = res.data['contacts'];
      this.sharedContactGroups = res.data['contactgroups'];
    });
  }

  toggleRemoving(event: any, id: number, isContact: boolean = true) {
    event.preventDefault();
    var index = -1;
    if (isContact) {
      index = this.removedContacts.indexOf(id);
      if (index != -1) {
        this.removedContacts.splice(index, 1);
      } else {
        this.removedContacts.push(id);
      }
    } else {
      index = this.removedContactGroups.indexOf(id);
      if (index != -1) {
        this.removedContactGroups.splice(index, 1);
      } else {
        this.removedContactGroups.push(id);
      }
    }

    if (this.removedContactGroups.length > 0 || this.removedContacts.length > 0) {
      this.hasDeletedItems = true;
    } else {
      this.hasDeletedItems = false;
    }
  }

  isDeletedItem(id: number, isContact: boolean = true) {
    var index: any;
    if (isContact) {
      index = this.removedContacts.indexOf(id);
    } else {
      index = this.removedContactGroups.indexOf(id);
    }
    return ((index != -1) ? true : false);
  }

  save() {
    //save removing items

    if (this.hasDeletedItems || this.hasUpdatedItems) {
      let body = this.hasDeletedItems ? JSON.stringify({
        photos: _.map(this.selectedItems, 'id'), albums: [],
        contacts: _.xor(_.map(this.sharedContacts, 'id'), this.removedContacts),
        groups: _.xor(_.map(this.sharedContactGroups, 'id'), this.removedContactGroups)
      })
        : JSON.stringify({
        photos: _.map(this.selectedItems, 'id'), albums: [],
        contacts: _.map(_.concat(this.sharedContacts, this.selectedContacts), 'id'),
        groups: _.map(_.concat(this.sharedContactGroups, this.selectedContactGroups), 'id')
      });

      this.mediaSharingService.update(body).subscribe((res: any) => {
          this.sharedContacts = res.data['contacts'];
          this.sharedContactGroups = res.data['contactgroups'];

          if (this.hasDeletedItems) {
            this.removedContacts = [];
            this.removedContactGroups = [];
            this.hasDeletedItems = false;
          } else {
            this.selectedContacts = [];
            this.selectedContactGroups = [];
            this.hasUpdatedItems = false;
          }
        },
        (error: any) => {
          console.log('error', error);
        });

    } else { // save adding sharing
      let body = JSON.stringify({
        photos: _.map(this.selectedItems, 'id'), albums: [],
        contacts: _.map(this.selectedContacts, 'id'), groups: _.map(this.selectedContactGroups, 'id')
      });

      this.mediaSharingService.add(body).subscribe((result: any) => {
          this.sharedContacts = result['data'].contacts;
          this.sharedContactGroups = result['data'].contactgroups;
          this.selectedContacts = [];
          this.selectedContactGroups = [];
        },
        (error: any) => {
          console.log('error', error);
        });
    }
    // console.log('save');
  }

  cancel() {
    //cancel removing items
    // if (this.hasDeletedItems){
    //
    // }else{ // cancel adding sharing
    //
    // }
    console.log('cancel');
  }

  selectContact(contact: any) {
    console.log('contacts', this.selectedContacts, contact);
    this.selectedContacts.push(contact);
    console.log('contacts after', this.selectedContacts, contact);
    this.setUpdatedItemsStatus();
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.setUpdatedItemsStatus();
  }

  searchContact(event: any) {
    this.filteredContacts = _.filter(this.contacts,
      (c: any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  selectContactGroup(group: any) {
    this.selectedContactGroups.push(group);
    this.setUpdatedItemsStatus();
  }

  unSelectContactGroup(group: any) {
    _.remove(this.selectedContactGroups, (c: any) => {
      return c['id'] == group['id'];
    });
    this.setUpdatedItemsStatus();
  }

  searchContactGroup(event: any) {
    this.filteredContactGroups = _.filter(this.contactGroups,
      (c: any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  private setUpdatedItemsStatus() {
    this.hasUpdatedItems = ((this.selectedContacts.length > 0 || this.selectedContactGroups.length > 0)
    && (this.sharedContacts.length > 0 || this.sharedContactGroups.length > 0)) ? true : false;
  }

  private getContacts() {
    this.mediaSharingService.getContacts().subscribe((res: any)=> {
      this.contacts = res.data;
    });
  }

  private getContactGroups() {
    this.mediaSharingService.getContactGroups().subscribe((res: any)=> {
      this.contactGroups = res.data;
    });
  }
}
