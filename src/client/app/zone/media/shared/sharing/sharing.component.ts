import {
  Component,
  OnInit,
  ViewChild,
  Input
} from '@angular/core';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';
import { ZMediaSharingService } from './sharing.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-media-sharing',
  templateUrl: 'sharing.component.html'
})
export class ZMediaSharingComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;
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
