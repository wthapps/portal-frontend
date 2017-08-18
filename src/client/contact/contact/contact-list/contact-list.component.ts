import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';

import { Config } from '../../../core/shared/config/env.config';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';

import { ZContactService } from '../../shared/services/contact.service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { Constants } from '../../../core/shared/config/constants';
import { _wu } from '../../../core/shared/utils/utils';
import { _contact } from '../../shared/utils/contact.functions';
import { LabelService } from '../../label/label.service';

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

  contacts: any = [];
  filteredContacts: Array<any> = new Array<any>();
  actionsToolbarEvent: Subscription;
  tokens: any;
  tokensActionsBar: any;
  contact$: Observable<any>;
  originalContacts: any = [];

  linkSocial: string = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat: string = `${Config.SUB_DOMAIN.CHAT}/conversations/`;
  _contact: any = _contact;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public contactService: ZContactService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private confirmationService: ConfirmationService,
              private labelService: LabelService,
              private loadingService: LoadingService,
              private commonEventService: CommonEventService) {
    this.commonEventService.filter((event: CommonEvent) => event.channel == Constants.contactEvents.common).takeUntil(this.destroySubject).subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });
    this.page = 1;
    this.contact$ = this.contactService.contacts$;

  }

  ngOnInit() {
    this.commonEventService.filter((event: CommonEvent) => event.channel == Constants.contactEvents.actionsToolbar).takeUntil(this.destroySubject).subscribe((event: CommonEvent) => {
      let tmp = _.cloneDeep(this.contactService.selectedObjects);
      this.contactService.selectedObjects = [event.payload];
      this.doActionsToolbar(event);
      this.contactService.selectedObjects = tmp;
    });


    this.route.params.forEach((params: Params) => {
      if (params['search']) {
        this.contactService.search({search_value: params['search']});
      } else {
        switch (params['label']) {
          case 'all contacts':
          case 'undefined':
            this.contactService.filter({label: undefined});
            break;
          default:
            this.contactService.filter({label: params['label']});
            break;
        }
      }
    });

    this.contactService.contacts$
      .takeUntil(this.destroySubject)
      .subscribe((contacts: any[]) => {
        // this.contacts.length = 0;
        this.contacts = contacts.slice(0, this.ITEM_PER_PAGE * this.page);
        this.loadingService.stop();
      });
  }

  ngAfterViewInit() {
    this.loadingService.start('#contact-list');

    this.contactService.initLoad$
      .takeUntil(this.destroySubject)
      .subscribe((data: any) => {
        if (data === true)
          this.loadingService.stop('#contact-list');
      });
    this.cdr.detectChanges();
  }

  confirmDeleteContacts() {
    this.contactService.confirmDeleteContacts();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onLoadMore() {
    this.page += 1;
    // this.contacts = this.contactService.getAllContacts().slice(0, this.page * this.ITEM_PER_PAGE);
    this.contactService.onLoadMore();
  }

  viewContactDetail(contactId: any) {
    this.router.navigate(['contacts/detail/' + contactId]).then();
  }

  editContact(contactId: any) {
    this.router.navigate(['contacts/' + contactId]).then();
  }

  doEvent(event: any) {
    console.log('doEvent in contact list:::', event);
    switch (event.action) {
      case 'open_add_label_modal':
        let labels: any[] = [];
        if (this.contactService.selectedObjects.length > 1) {
          labels = _contact.getSameLables(this.contactService.selectedObjects);
        } else if (this.contactService.selectedObjects.length == 1) {
          labels = this.contactService.selectedObjects[0].labels;
          event.mode = 'edit';
        }

        this.modal.open({mode: event.mode, labels: labels, contacts: this.contactService.selectedObjects});
        break;

      // this will handle all cases as: favourite, add to label
      // after updating, deleting, importing we must update local CONTACT list data
      case 'contact:contact:update':
        let selectedObjects = (event.payload && event.payload.selectedObjects) ? event.payload.selectedObjects : this.contactService.selectedObjects;
        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        this.contactService.update(selectedObjects).subscribe((res: any) => {
          console.log(res);
        });
        break;
    }
  }

  toggleLabel(name: string) {
    let label = _.find(this.labelService.getAllLabelSyn(), (label: any) => {
      return label.name == name;
    });
    if (_contact.isContactsHasLabelName(this.contactService.selectedObjects, name)) {
      _contact.removeLabelContactsByName(this.contactService.selectedObjects, name);
    } else {
      _contact.addLabelContacts(this.contactService.selectedObjects, label);
    }
    this.contactService.update(this.contactService.selectedObjects).subscribe((res: any) => {
      console.log(res);
    });
  }

  doActionsToolbar(event: any) {
    if (event.action == 'favourite') {
      // this.toggleLabelB(this.contactService.selectedObjects, 'favourite');
      this.toggleLabel('favourite');
    }

    if (event.action == 'blacklist') {
      this.toggleLabel('blacklist');
    }

    if (event.action == 'tag') {
      this.doEvent({action: 'open_add_label_modal'});
    }

    if (event.action == 'delete') {
      this.contactService.confirmDeleteContacts(this.contactService.selectedObjects);
    }

    if (event.action == 'social') {
      if (this.contactService.selectedObjects && this.contactService.selectedObjects[0].wthapps_user && this.contactService.selectedObjects[0].wthapps_user.uuid) {
        window.location.href = this.linkSocial + this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action == 'chat') {
      if (this.contactService.selectedObjects && this.contactService.selectedObjects[0].wthapps_user && this.contactService.selectedObjects[0].wthapps_user.uuid) {
        window.location.href = this.linkChat + this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action == 'view_detail') {
      this.viewContactDetail(this.contactService.selectedObjects[0].id);
    }

    if (event.action == 'edit_contact') {
      this.router.navigate(['contacts', this.contactService.selectedObjects[0].id, {mode: 'edit'}]).then();
    }
  }

  addTags(event: any) {
    this.modal.open();
  }

}
