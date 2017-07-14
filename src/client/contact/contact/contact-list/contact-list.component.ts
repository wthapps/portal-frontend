import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { Observable } from 'rxjs/Observable';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { ConfirmationService } from 'primeng/primeng';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy, CommonEventAction {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;

  // data: any = [];
  eventThreeDot: any;
  eventAddContact: any;
  commonEventSub: Subscription;
  contact$: Observable<any>;
  originalContacts: any = [];


  constructor(private contactService: ZContactService,
              private route: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private commonEventService: CommonEventService
  ) {
    this.commonEventSub = this.commonEventService.event.subscribe((event: any) => {
      this.doEvent(event);
    });

    this.contact$ = this.contactService.contacts$;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log('change params::::', params);
    });

    this.getAllContact();
    this.eventThreeDot = this.contactService.contactThreeDotActionsService.eventOut.subscribe((event: any) => {
      if (event.action == "deleted") {
        this.getAllContact();
      }
    });
    this.eventAddContact = this.contactService.contactAddContactService.eventOut.subscribe((event: any) => {
      // this.data = event.data;

      this.contactService.addMoreContacts(_.get(event, 'data', []));
    });
  }

  onDeleteAll() {
    console.log('delete all');
    console.log(this.contactService.selectedObjects);
  }

  getAllContact() {
    // this.contactService.getContactList().take(1).subscribe(
    //   (res: any)=> {
    //     this.data = res.data;
    //   }
    // )
  }

  ngOnDestroy() {
    if (this.eventThreeDot) {
      this.eventThreeDot.unsubscribe();
    }
    if (this.eventAddContact) {
      this.eventAddContact.unsubscribe();
    }
    if (this.commonEventSub) {
      this.commonEventSub.unsubscribe();
    }
  }

  doEvent(event: any) {
    console.log('doEvent in contact list:::', event);
    switch(event.action) {
      case 'contact:contact:view_detail':
        this.router.navigate(['contacts/1']).then();
        break;

      case 'contact:contact:open_add_label_modal':
        this.modal.open({contact: event.payload.selectedContact});
        break;
      case 'contact:contact:import':
        break;

      // this will handle all cases as: favourite, add to label
      // after updating, deleting, importing we must update local CONTACT list data
      case 'contact:contact:update':
        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        console.log('updating contact......', event.payload.contact);
        this.contactService.update(event.payload.contact).subscribe((response: any) => {

        });
        break;
      case 'contact:contact:delete':
        this.delete();
        break;
    }
  }

  delete(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.contactService.deleteContact(data).subscribe((res: any) => {
          // MUST update local data here
          // this.contactService.contactThreeDotActionsService.sendOut({action: "deleted"});
        });
      }
    });
  }

  addTags(event: any) {
    this.modal.open();
  }
}
