import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, SimpleChanges} from '@angular/core';
import {ApiBaseService} from '../../../shared/services/apibase.service';


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
  @Input() selectedItems: Array<any>;
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  textContacts: string;
  textContactGroups: string;
  hasDeletedItems: boolean;
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
    this.contacts = new Array<any>();
    this.contactGroups = new Array<any>();
    this.removedContacts = new Array<any>();
    this.removedContactGroups = new Array<any>();
    this.selectedContacts = new Array<any>();
    this.selectedContactGroups = new Array<any>();

    this.apiService.get(`zone/contacts`)
      .subscribe((result: any) => {
          this.contacts = result['data'];
          this.filteredContacts = result['data'];
        },
        error => {
          console.log('error', error);
        });
    this.apiService.get(`zone/contactgroups`)
      .subscribe((result: any) => {
          this.contactGroups = result['data'];
          this.filteredContactGroups = result['data'];
        },
        error => {
          console.log('error', error);
        });
  }

  ngAfterViewInit() {
    let _this = this;
    $('#sharingModal').on('hidden.bs.modal', function (e) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.modalShow) {
      $('#sharingModal').modal('show');
    }
    if (changes['selectedItems'].currentValue['length'] > 0) {
      console.log('change', changes);
      let body = JSON.stringify({ photos: _.map(this.selectedItems, 'id'), albums: [] });
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
    if(isContact) {
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
    // console.log ('length', this.removedContactGroups.length, this.removedContacts.length, this.hasDeletedItems);
  }

  isDeletedItem(id: number, isContact: boolean = true) {
    var index: any;
    if(isContact) {
      index = this.removedContacts.indexOf(id);
    } else {
      index = this.removedContactGroups.indexOf(id);
    }
    return ((index != -1) ? true: false);
  }

  save() {
    //save removing items

    if (this.hasDeletedItems){

    }else{ // save adding sharing
      let body = JSON.stringify({ photos: _.map(this.selectedItems, 'id'), albums: [],
        contacts: _.map(this.contacts, 'id'), groups: _.map(this.contactGroups, 'id')});
      this.apiService.post(`zone/sharings`, body)
        .subscribe((result: any) => {
            console.log('shared', result);
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

  selectContact(contact: any){
    this.selectedContacts.push(contact);
  }

  unSelectContact(contact: any){
    _.remove(this.selectedContacts,(c) => { return c['id'] == contact['id'] });
  }

  searchContact(event: any) {
    this.filteredContacts = _.filter(this.contacts, (c) => { return c['name'].toLowerCase().indexOf(event.query) != -1 });
  }

  selectContactGroup(group: any){
    this.selectedContactGroups.push(group);
  }

  unSelectContactGroup(group: any){
    _.remove(this.selectedContactGroups,(c) => { return c['id'] == group['id'] });
  }

  searchContactGroup(event: any) {
    this.filteredContactGroups = _.filter(this.contactGroups, (c) => { return c['name'].toLowerCase().indexOf(event.query) != -1 });
  }

}
