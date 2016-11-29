import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-sharing',
  templateUrl: 'sharing.component.html',
  styleUrls: ['sharing.component.css']
})
export class ZoneSharingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow: any;
  @Input() mediaType: any;
  @Input() selectedItems: Array<any>;
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onItemUpdated: EventEmitter<any> = new EventEmitter<any>();

  textContacts: string;
  textContactGroups: string;
  hasDeletedItems: boolean;
  hasUpdatedItems: boolean;
  contacts: Array<any>;
  contactGroups: Array<any>;
  selectedContacts: Array<any>;
  selectedContactGroups: Array<any>;
  sharedContacts: Array<any>;
  sharedContactGroups: Array<any>;
  removedContacts: Array<any>;
  removedContactGroups: Array<any>;
  filteredContacts: Array<any>;
  filteredContactGroups: Array<any>;

  constructor(private apiService: ApiBaseService) {

  }

  ngOnInit() {
    this.hasDeletedItems = false;
    this.hasUpdatedItems = false;
    this.contacts = new Array<any>();
    this.contactGroups = new Array<any>();
    this.removedContacts = new Array<any>();
    this.removedContactGroups = new Array<any>();
    this.selectedContacts = new Array<any>();
    this.selectedContactGroups = new Array<any>();
    this.sharedContacts = new Array<any>();
    this.sharedContactGroups = new Array<any>();
    this.textContacts = '';
    this.textContactGroups = '';

    this.apiService.get(`zone/contacts`)
      .subscribe((result: any) => {
          this.contacts = result['data'];
          this.filteredContacts = result['data'];
        },
        error => {
          // console.log('error', error);
        });
    this.apiService.get(`zone/contactgroups`)
      .subscribe((result: any) => {
          this.contactGroups = result['data'];
          this.filteredContactGroups = result['data'];
        },
        error => {
          // console.log('error', error);
        });
  }

  ngAfterViewInit() {
    let _this = this;
    $('#sharingModal').on('hidden.bs.modal', function (e:any) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.modalShow) {
      $('#sharingModal').modal({
        backdrop: 'static'
        //'show'
      });
    }

    if (changes['modalShow'] && changes['modalShow'].currentValue) {
      let body = JSON.stringify({photos: _.map(this.selectedItems, 'id'), albums: []});
      this.apiService.post(`zone/sharings/get_sharing_info`, body)
        .map(res => res.json())
        .subscribe((result: any) => {
            this.sharedContacts = result['data']['contacts'];
            this.sharedContactGroups = result['data']['contactgroups'];
          },
          error => {
            console.log('error', error);
          });
    }
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

      this.apiService.put(`zone/sharings/update`, body)
        .map(res => res.json())
        .subscribe((result: any) => {
            this.sharedContacts = result['data'].contacts;
            this.sharedContactGroups = result['data'].contactgroups;

            if (this.hasDeletedItems) {
              this.removedContacts = [];
              this.removedContactGroups = [];
              this.hasDeletedItems = false;
            } else {
              this.selectedContacts = [];
              this.selectedContactGroups = [];
              this.hasUpdatedItems = false;
            }
            this.onItemUpdated.emit(result['data'].photos[0]);
          },
          error => {
            console.log('error', error);
          });
    } else { // save adding sharing
      let body = JSON.stringify({
        photos: _.map(this.selectedItems, 'id'), albums: [],
        contacts: _.map(this.selectedContacts, 'id'), groups: _.map(this.selectedContactGroups, 'id')
      });
      this.apiService.post(`zone/sharings`, body)
        .map(res => res.json())
        .subscribe((result: any) => {
            this.sharedContacts = result['data'].contacts;
            this.sharedContactGroups = result['data'].contactgroups;
            this.selectedContacts = [];
            this.selectedContactGroups = [];
            this.onItemUpdated.emit(result['data'].photos[0]);
          },
          error => {
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
    _.remove(this.selectedContacts, (c:any) => {
      return c['id'] == contact['id'];
    });
    this.setUpdatedItemsStatus();
  }

  searchContact(event: any) {
    this.filteredContacts = _.filter(this.contacts,
      (c:any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  selectContactGroup(group: any) {
    this.selectedContactGroups.push(group);
    this.setUpdatedItemsStatus();
  }

  unSelectContactGroup(group: any) {
    _.remove(this.selectedContactGroups, (c:any) => {
      return c['id'] == group['id'];
    });
    this.setUpdatedItemsStatus();
  }

  searchContactGroup(event: any) {
    this.filteredContactGroups = _.filter(this.contactGroups,
      (c:any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  private setUpdatedItemsStatus() {
    this.hasUpdatedItems = ((this.selectedContacts.length > 0 || this.selectedContactGroups.length > 0)
    && (this.sharedContacts.length > 0 || this.sharedContactGroups.length > 0)) ? true : false;
  }

}
