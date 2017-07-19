import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { Observable } from 'rxjs/Observable';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { ConfirmationService } from 'primeng/primeng';
import { Config } from '../../../core/shared/config/env.config';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy, CommonEventAction {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;

  eventThreeDot: any;
  eventAddContact: any;
  commonEventSub: Subscription;
  contact$: Observable<any>;
  originalContacts: any = [];

  linkSocial: string = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat: string = `${Config.SUB_DOMAIN.CHAT}/conversations/`;

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

    this.eventThreeDot = this.contactService.contactThreeDotActionsService.eventOut.subscribe((event: any) => {
      if (event.action == "deleted") {
      }
    });
    this.eventAddContact = this.contactService.contactAddContactService.eventOut.subscribe((event: any) => {
      this.contactService.addMoreContacts(_.get(event, 'data', []));
    });
  }

  confirmDeleteContacts() {
    this.contactService.confirmDeleteContacts();
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
        let labels = [];
        console.log('selected item count', this.contactService.selectedObjects.length);
        if(this.contactService.selectedObjects.length > 1) {
          labels = [];
        } else if(this.contactService.selectedObjects.length == 1) {
          labels = this.contactService.selectedObjects[0].labels
        }

        this.modal.open({mode: event.mode, labels: labels});
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


  toggleLabel(name: string) {
    let event: any = {
      action: 'contact:contact:update',
      payload: {
        labels: name=='favourite' ? [{
          id: 3,
          uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c02',
          name: 'favourite',
          user_id: null,
          system: true
        }] : [{
          id: 6,
          uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c99',
          name: 'blacklist',
          user_id: null,
          system: true
        }]
      }
    };

    if (this.hasLabel(name)) {
      this.removeLabel(name);
    } else {
      this.addLabel(event.payload.labels[0]);
    }
     this.doEvent(event)
  }

  hasLabel(name: string): boolean {
    let result = true;
    _.forEach(this.contactService.selectedObjects, (contact: any) => {
      if (_.some(contact.labels, {name: name}) == false){
        result = false;
        return;
      }
    });
    return result;
  }

  removeLabel(name: string) {
    _.forEach(this.contactService.selectedObjects, (contact: any) => {
      _.remove(contact.labels, (label: any) => label.name === name);
    });
  }

  addLabel(label: any) {
    _.forEach(this.contactService.selectedObjects, (contact: any) => {
      contact.labels.push(label);
    });
  }

  addTags(event: any) {
    this.modal.open();
  }

}
