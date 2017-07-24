import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { Observable } from 'rxjs/Observable';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { ConfirmationService } from 'primeng/primeng';
import { Config } from '../../../core/shared/config/env.config';
import { LoadingService } from '../../../core/partials/loading/loading.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy, AfterViewInit, CommonEventAction {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;

  ITEM_PER_PAGE: number = 20;
  page: number = 1;

  contacts: Array<any> = new Array<any>([]);
  filteredContacts: Array<any> = new Array<any>();

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
              private loadingService: LoadingService,
              private commonEventService: CommonEventService
  ) {
    this.commonEventSub = this.commonEventService.event.subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  ngOnInit() {
    this.page = 1;
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

  ngAfterViewInit() {
    this.loadingService.start();
    this.contactService.contacts$
      .subscribe((contacts: any[]) => {
        // this.contacts = contacts.splice(0, this.ITEM_PER_PAGE * this.page);
        //   TODO: Update contacts locally
        //   this.contacts.length = 0;
        this.contacts = contacts.slice(0, this.ITEM_PER_PAGE * this.page);

        console.debug('inside contact list onInit: ', this.contacts, contacts);
        this.loadingService.stop();
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

  onLoadMore() {
    this.page += 1;
    this.contacts = this.contactService.getAllContacts().slice(0, this.page * this.ITEM_PER_PAGE);
    console.log('on Load more: ',  this.contacts.length, this.page);
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
          labels = this.contactService.selectedObjects[0].labels;
          event.mode = 'edit';
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



        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        if (this.contactService.selectedObjects.length > 1) {
          if (event.payload.labels !== 'undefined' && event.payload.toggleLabel == undefined) {

            _.forEach(this.contactService.selectedObjects, (contact: any) => {
              contact.labels = _.union(contact.labels, event.payload.labels);
            });
          }

          params = JSON.stringify({contacts: this.contactService.selectedObjects});
          multiple = true;
        } else {
          if (event.payload.labels !== 'undefined' && event.payload.toggleLabel == undefined) {
            _.forEach(this.contactService.selectedObjects, (contact: any) => {
              contact.labels = event.payload.labels
            });
          }

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
        toggleLabel: true,
        labels: [
          name =='favourite' ? {
            id: 3,
            uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c02',
            name: 'favourite',
            system: true
          } : {
            id: 6,
            uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c99',
            name: 'blacklist',
            system: true
          }
        ]
      }
    };

    // let label = name =='favourite' ? {
    //   id: 3,
    //   uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c02',
    //   name: 'favourite',
    //   system: true
    // } : {
    //   id: 6,
    //   uuid: '65c3e97c-9c52-4b91-9cd5-8561e4ce0c99',
    //   name: 'blacklist',
    //   system: true
    // };

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
