import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';
import {ApiBaseService} from '../../../shared/services/apibase.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-formSharing',
  templateUrl: 'form-sharing.component.html',
  styleUrls: ['form-sharing.component.css']
})
export class ZPictureSharingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow: any;
  @Input() photoIds: Array<any>;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  hasDeletedItems: boolean;
  contacts: Array<any>;
  contactGroups: Array<any>;
  sharedContacts: Array<any>;
  sharedContactGroups: Array<any>;
  removedContacts: Array<any>;
  removedContactGroups: Array<any>;

  constructor(private apiService: ApiBaseService){

  }

  ngOnInit() {
    this.hasDeletedItems = false;
    this.contacts = new Array<any>();
    this.contactGroups = new Array<any>();
    this.removedContacts = new Array<any>();
    this.removedContactGroups = new Array<any>();

    this.apiService.get(`zone/contacts`)
      .subscribe((result: any) => {
          this.contacts = result['data'];
        },
        error => {

        });
    this.apiService.get(`zone/contactgroups`)
      .subscribe((result: any) => {
          this.contactGroups = result['data'];
        },
        error => {

        });
  }

  ngAfterViewInit() {
    let _this = this;
    $('#sharingModal').on('hidden.bs.modal', function (e) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges() {
    if (this.modalShow) {
      $('#sharingModal').modal('show');
    }
  }

  toggleRemoving(event: any, id: number, isContact: boolean = true){
    event.preventDefault();
    var index = -1;
    if(isContact){
      index = this.removedContacts.indexOf(id);
      if (index != -1){
        this.removedContacts.splice(index, 1);
      }else{
        this.removedContacts.push(id);
      }
    }else{
      index = this.removedContactGroups.indexOf(id);
      if (index != -1){
        this.removedContactGroups.splice(index, 1);
      }else{
        this.removedContactGroups.push(id);
      }

    }

    if (this.removedContactGroups.length > 0 || this.removedContacts.length > 0){
      this.hasDeletedItems = true;
    }else {
      this.hasDeletedItems = false;
    }
    console.log ('length', this.removedContactGroups.length, this.removedContacts.length, this.hasDeletedItems);
  }

  isDeletedItem(id: number, isContact: boolean = true){
    var index: any;
    if(isContact){
      index = this.removedContacts.indexOf(id);
    }else{
      index = this.removedContactGroups.indexOf(id);
    }
    return ((index != -1) ? true: false);
  }

  save(){
    //save removing items
    if (this.hasDeletedItems){

    }else{ // save adding sharing

    }

  }

  cancel(){
    //cancel removing items
    if (this.hasDeletedItems){

    }else{ // cancel adding sharing

    }
  }
}
