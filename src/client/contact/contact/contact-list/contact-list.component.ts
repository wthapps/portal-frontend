import { Component, OnInit, OnDestroy } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy {
  data: any = [];
  eventThreeDot: any;

  constructor(private contactService: ZContactService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params);
    });

    this.getAllContact();

    this.eventThreeDot = this.contactService.contactThreeDotActionsService.eventOut.subscribe((event: any) => {
      if (event.action == "deleted") {
        this.getAllContact();
      }
    });
  }

  onDeleteAll() {
    console.log('delete all');
    console.log(this.contactService.selectedObjects);
  }

  getAllContact() {
    this.contactService.getContactList().subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    )
  }

  ngOnDestroy() {
    this.eventThreeDot.unsubscribe();
  }
}
