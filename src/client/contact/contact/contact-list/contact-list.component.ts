import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy, CommonEventAction {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;

  data: any = [];
  eventThreeDot: any;
  eventAddContact: any;
  commonEventSub: Subscription;


  constructor(private contactService: ZContactService, private route: ActivatedRoute,
              private commonEventService: CommonEventService
  ) {
    // this.commonEventSub = this.commonEventService.event.subscribe((event: any) => {
    //   this.doEvent(event);
    // });
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
    this.eventAddContact = this.contactService.contactAddContactService.eventOut.subscribe((event: any) => {
      this.data = event.data;
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
    this.eventAddContact.unsubscribe();
    this.commonEventSub.unsubscribe();
  }

  doEvent(event: any) {
    console.log('I am doing event !!!!', event);
  }

  addTags(event: any) {
    this.modal.open();
  }
}
