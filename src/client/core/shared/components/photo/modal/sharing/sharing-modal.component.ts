import { Component, OnInit, ViewChild, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaSharingService } from './sharing.service';
import { Constants } from '../../../../config/constants';
import { WthAppsBaseModal } from '../../../../interfaces/wthapps-base-modal';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'sharing-modal',
  templateUrl: 'sharing-modal.component.html'
})
export class SharingModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @Input() selectedItems: any = [];
  @Input() type: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

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

  noSelectedContacts: boolean = true;

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
    // this.getContacts();
    // this.getContactGroups();
  }

  ngOnDestroy() {
    this.contactTerm$.unsubscribe();
  }

  open(options: any) {
    this.selectedItems = options['selectedObjects'];
    console.log('Sharing selectedItems: ', options['selectedObjects']);
    this.getShared();
    this.modal.open(options)
      .then((res: any) => console.log('Sharing modal opened!!!', res));
  }

  close(options?: any) {
    this.modal.close();
  }

  getShared() {
    let body = {
      photos: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'photo'), 'id')
      , albums: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'album'), 'id')
    };
    this.mediaSharingService.getShared(body).take(1).subscribe((res: any)=> {
      // this.sharedContacts = res.data['contacts'];
      this.sharedContacts = _.get(res, 'data.contacts', []);
      this.sharedContactGroups = _.get(res, 'data.contactgroups', []);
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

    // Check if there is no contacts selected
    this.setNoSelectedContacts();
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
      let body = this.hasDeletedItems ? {
        photos: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'photo'), 'id'),
        albums: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'album'), 'id'),
        contacts: _.xor(_.concat(_.map(this.sharedContacts, 'id'), _.map(this.selectedContacts, 'id')), this.removedContacts),


        // groups: _.xor(_.map(this.sharedContactGroups, 'id'), this.removedContactGroups)
      }
        : {
        photos: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'photo'), 'id'),
        albums: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'album'), 'id'),
        contacts: _.map(_.concat(this.sharedContacts, this.selectedContacts), 'id'),
        // groups: _.map(_.concat(this.sharedContactGroups, this.selectedContactGroups), 'id')
      };

      this.mediaSharingService.update(body).take(1).subscribe((res: any) => {
          console.log(res);
          this.sharedContacts = res.data['contacts'];
          // this.sharedContactGroups = res.data['contactgroups'];

          if (this.hasDeletedItems) {
            this.removedContacts = [];
            // this.removedContactGroups = [];
            this.hasDeletedItems = false;
          } else {
            this.selectedContacts = [];
            // this.selectedContactGroups = [];
            this.hasUpdatedItems = false;
          }

          this.updateSelectedItems({contacts: this.sharedContacts});
        },
        (error: any) => {
          console.log('error', error);
        });

    } else { // save adding sharing
      let body = {
        photos: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'photo'), 'id'),
        albums: _.map(_.filter(this.selectedItems, (i: any) => i.object_type == 'album'), 'id'),
        contacts: _.map(this.selectedContacts, 'id'), groups: _.map(this.selectedContactGroups, 'id')
      };

      // Only subscribe to this action once
      this.mediaSharingService.add(body).take(1).subscribe((res: any) => {
          this.sharedContacts = res['data']['contacts'];
          this.sharedContactGroups = res['data']['contactgroups'];
          this.selectedContacts = [];
          this.selectedContactGroups = [];

          //  TODO: Update sharing result to invoked component: Album detail, photo detail ...
          this.updateSelectedItems({contacts: this.sharedContacts});
        },
        (error: any) => {
          console.log('error', error);
        });
    }

    this.modal.close().then(() =>
      console.log('Item shared')
    );
    // console.log('save');
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
    this.noSelectedContacts = false;
    this.setUpdatedItemsStatus();
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.setUpdatedItemsStatus();
    this.setNoSelectedContacts();
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
    // this.hasUpdatedItems = ((this.selectedContacts.length > 0 || this.selectedContactGroups.length > 0)
    // && (this.sharedContacts.length > 0 || this.sharedContactGroups.length > 0)) ? true : false;

    this.hasUpdatedItems = ((this.selectedContacts.length > 0 )
    && (this.sharedContacts.length > 0 )) ? true : false;
  }

  private setNoSelectedContacts() {
    this.noSelectedContacts = (this.selectedContacts.length > 0 ) ? false : true;
  }

  // private getContacts() {
  //   this.mediaSharingService.getContacts().subscribe((res: any)=> {
  //     this.contacts = res.data;
  //   });
  // }

  private getContactGroups() {
    this.mediaSharingService.getContactGroups().subscribe((res: any)=> {
      this.contactGroups = res.data;
    });
  }
}
