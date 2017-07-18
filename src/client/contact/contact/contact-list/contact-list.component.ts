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

  contacts: Array<any> = new Array<any>();
  filteredContacts: Array<any> = new Array<any>();

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


  }

  ngOnInit() {
    this.contact$ = this.contactService.contacts$;

    this.route.params.forEach((params: Params) => {
      console.log('params::::', params['label']);

      switch(params['label']) {
        case 'all contact':
        case 'undefined':
          this.contactService.filter({label: undefined});
          break;
        default:
          this.contactService.filter({label: params['label']});
          break;
      }
    });

    this.getContacts();
    this.eventThreeDot = this.contactService.contactThreeDotActionsService.eventOut.subscribe((event: any) => {
      if (event.action == "deleted") {
        this.getContacts();
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


  confirmDeleteContacts() {
    this.contactService.confirmDeleteContacts();
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
        this.modal.open({mode: event.mode});
        break;
      case 'contact:contact:open_edit_label_modal':
        this.modal.open({contact: event.payload.selectedContact});
        break;
      case 'contact:contact:import':
        break;

      // this will handle all cases as: favourite, add to label
      // after updating, deleting, importing we must update local CONTACT list data
      case 'contact:contact:update':
        let params: any;
        let multiple: boolean = false;

        if (event.payload.labels !== 'undefined') {
          let selectedContacts = this.contactService.selectedObjects;
          _.forEach(selectedContacts, (contact: any) => {
            contact.labels = _.merge(contact.labels, event.payload.labels);
            console.log('selected contact:::', contact.labels);
          });
        }

        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        if (this.contactService.selectedObjects.length > 1) {
          params = JSON.stringify({contacts: this.contactService.selectedObjects});
          multiple = true;
        } else {
          params = this.contactService.selectedObjects[0];
          multiple = false;
        }

        this.contactService.update(params, multiple).subscribe((response: any) => {

        });
        break;
      case 'contact:contact:delete':
        // TODO:
        this.delete({id: 1});
        break;
    }
  }

  delete(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.contactService.confirmDeleteContact(data).then((res: any) => {
          // MUST update local data here
          // this.contactService.contactThreeDotActionsService.sendOut({action: "deleted"});
        });
      }
    });
  }


  favourite() {
    let event: any = {
      action: 'contact:contact:update',
      payload: {
        labels: [{
          id: 3,
          uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c02',
          name: 'favourite',
          user_id: null,
          system: true
        }]
      }
    };

    this.doEvent(event)
  }

  hasFavourite(): boolean {
    // _.forEach(this.contactService.selectedObjects, (contact: any) => {
    //   _.forEach(contact.labels, (label: any) => {
    //     if (label.name !== 'favourite') {
    //       return false;
    //     }
    //   })
    // });
    return true;
  }

  addTags(event: any) {
    this.modal.open();
  }

  private getContacts() {
    this.contacts = this.contactService.contacts;
    this.filteredContacts = this.contactService.contacts;
    console.log('get contacts:::', this.filteredContacts);
  }
}
