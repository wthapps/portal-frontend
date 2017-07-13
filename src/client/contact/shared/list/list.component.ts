import { Component, OnInit, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ZContactSharedListComponent implements OnInit {
  @Input() data: any;

  descending: boolean = false;
  currentSort: string = 'name';

  constructor(public contactService: ZContactService) {
  }

  ngOnInit() {

  }

  onSort(event: any) {
    if (this.currentSort == event) {
      this.descending = !this.descending;
    } else {
      this.descending = false;
      this.currentSort = event;
    }
    this.data = _.orderBy(this.data, [this.currentSort], [(this.descending ? 'desc' : 'asc')]);

    return false;
  }

  onSelectedAll() {
    if (this.contactService.selectedObjects.length == this.data.length) {
      this.contactService.sendListToItem(false);
      this.contactService.selectedObjects.length = 0;
    } else {
      this.contactService.sendListToItem(true);
      this.contactService.selectedObjects.length = 0;

      _.map(this.data, (v: any)=> {
        this.contactService.selectedObjects.push(v);
      });
    }
  }

}
