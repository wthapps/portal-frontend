import { Injectable } from '@angular/core';
import { Response } from '@angular/http';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import { ConfirmationService } from 'primeng/components/common/api';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { ContactImportContactDataService } from '../modal/import-contact/import-contact-data.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { SuggestionService } from '../../../core/shared/services/suggestion.service';
import { LabelService } from '../../label/label.service';
import { Router } from "@angular/router";
import { WTHConfirmService } from '../../../core/shared/services/wth-confirm.service';

declare var _: any;

@Injectable()
export class ZContactService extends BaseEntityService<any> {
  selectedObjects: any[] = [];
  contacts: Array<any> = new Array<any>();
  page: number = 1;

  confirmDialog: any;

  // orderDesc: boolean = false;
  readonly startIndex: number = 0;
  readonly ITEM_PER_PAGE: number = 20;

  listenToList: any;
  listenToItem: any;
  contacts$: Observable<any[]>;
  initLoad$: Observable<boolean>;
  orderDesc$: Observable<boolean>;
  isSelectAll$: Observable<boolean>;

  private isSelectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private initLoadSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private orderDescSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();
  private filterOption: any = {};
  private nextLink: string;


  constructor(protected apiBaseService: ApiBaseService,
              public importContactDataService: ContactImportContactDataService,
              public labelService: LabelService,
              private suggestService: SuggestionService,
              private toastsService: ToastsService,
              public router: Router,
              private confirmationService: ConfirmationService,
              private wthConfirmService: WTHConfirmService) {
    super(apiBaseService);
    this.url = 'contact/contacts';

    this.listenToList = this.listenToListSource.asObservable();
    this.listenToItem = this.listenToItemSource.asObservable();
    this.contacts$ = this.contactsSubject.asObservable();
    this.initLoad$ = this.initLoadSubject.asObservable();
    this.orderDesc$ = this.orderDescSubject.asObservable();
    this.isSelectAll$ = this.isSelectAllSubject.asObservable();


    this.suggestService.input$.subscribe((input: any) => {
      let contacts: any[] = _.cloneDeep(this.searchContact(input));
      this.suggestService.setSuggestion(contacts);

      console.log('input: ', input, ' - result: ', contacts);
    });
  }

  getAllContacts() {
    return _.orderBy(this.contacts, ['name'], [this.orderDescSubject.getValue() ? 'asc' : 'desc']);
  }

  resetPageNumber() {
    this.page = 1;
  }

  onLoadMore(orderDesc?: boolean) {

    this.page += 1;
    let order: boolean = orderDesc || this.orderDescSubject.getValue();
    if (order !== undefined)
      this.orderDescSubject.next(order);
    this.notifyContactsObservers();
  }

  changeSortOption(order?: string) {
    if (order === undefined)
      this.orderDescSubject.next(!this.orderDescSubject.getValue());
    else
      this.orderDescSubject.next((order !== 'asc'));

    this.notifyContactsObservers();
  }

  addMoreContacts(data: any[]) {
    // this.contacts = _.uniqBy(_.flatten([this.contacts, data]), 'id');
    this.contacts.push(...data);
    this.notifyContactsObservers();
  }

  delete(contact: any): Observable<any> {
    return super.delete(`${contact.id}`)
      .map((response: any) => {
        this.deleteCallback(response.data);
      });
  }

  confirmDeleteContact(contact: any): Promise<any> {
    this.selectedObjects.length = 0;
    this.selectedObjects = [contact];
    return this.confirmDeleteContacts();
  }

  confirmDeleteContacts(contacts: any[] = this.selectedObjects): Promise<any> {
    let contact_names: string = _.map(contacts, (ct: any) => ct.name).join(', ');
    let contact_length: number = contacts.length;
    return new Promise((resolve) => {

      this.wthConfirmService.updateConfirmDialog({
        label: {
          accept: 'Delete',
          reject: 'Cancel',
        }
      });

      this.confirmationService.confirm({
        message: `Are you sure you want to delete following ${contact_length} contacts:  ${contact_names} ?`,
        header: 'Delete Contacts',
        accept: () => {
          this.deleteSelectedContacts(contacts).then(() => {
            this.toastsService.success(`Delete ${contact_length} contacts successfully`);
            resolve();
            this.router.navigate(['contacts']);
          });
        }
      });
    });
  }

  addItemSelectedObjects(item: any) {
    this.selectedObjects.push(item);
    this.checkSelectAll();
  }

  removeItemSelectedObjects(item: any) {
    _.remove(this.selectedObjects, {
      'uuid': item.uuid
    });
    this.checkSelectAll();
  }

  isSelectAll(): boolean {
    return this.isSelectAllSubject.getValue();
  }

  checkSelectAll() {
    // let isSelectAll = _.isEqual(this.contactsSubject.getValue().map((c: any) => c.id).sort(), this.selectedObjects.map((c: any) => c.id).sort());
    let isSelectAll = this.contactsSubject.getValue().length === this.selectedObjects.length;
    this.isSelectAllSubject.next(isSelectAll);
  }

  sendListToItem(event: any) {
    this.listenToListSource.next(event);

    this.isSelectAllSubject.next(!this.isSelectAllSubject.getValue());
  }

  sendItemToList(event: any) {
    this.listenToItemSource.next(event);
  }

  updateMultiple(body: any): Observable<any> {
    return this.apiBaseService.post(`${this.url}/update_multiple`, body)
      .map(
        (response: any) => {
          let contacts = response.data;

          _.forEach(contacts, (contact: any) => {
            this.updateCallback(contact);
          });
          return response;
        }
      );
  }

  updateSingle(body: any): Observable<any> {
    return super.update(body)
      .map((res: any) => {
          this.updateCallback(res.data);
          return res;
        }
      );
  }

  update(data: any): Observable<any> {
    if (data && _.isArray(data)) {
      if (data.length > 1) {
        return this.updateMultiple({contacts: data});
      } else {
        return this.updateSingle(data[0]);
      }
    } else {
      return this.updateSingle(data);
    }
  }

  create(body: any): Observable<any> {
    return super.create(body)
      .map((res: any) => {
        this.createCallback(res.data);
        return res;
      });
  }

  addContact(data: any): Promise<any> {
    return this.apiBaseService.post(`${this.url}`, data).toPromise().then((res: any) => this.createCallback(res.data));
  }

  importGoogleContacts(data: any) {
    return this.apiBaseService.post(`${this.url}/import_google_contacts`, data);
  }

  getGoogleApiConfig() {
    return this.apiBaseService.get(`${this.url}/get_google_api_config`);
  }

  filter(options: any) {
    this.resetPageNumber();
    let label = _.get(options, 'label', 'undefined');
    this.filterOption = {'label': label};

    this.notifyContactsObservers();
  }

  filterByLabel(label?: string) {
    let contacts: any[] = [];
    if (label === undefined || label === 'undefined')
      contacts = this.contacts;
    else {
      contacts = _.filter(this.contacts, (contact: any)=> {
        let clabels = _.map(contact.labels, 'name');
        if (_.indexOf(clabels, label) > -1)
          return contact;
      });
    }

    return contacts;
  }

  // Search by name, email, phone number
  search(options: any) {
    this.resetPageNumber();
    let search_value = _.get(options, 'search_value', '').trim().toLowerCase();
    this.filterOption = {'search': search_value};

    this.notifyContactsObservers();
  }

  resetSelectedObjects() {
    this.selectedObjects.length = 0;
    this.notifyContactsObservers();
    this.checkSelectAll();
  }

  notifyContactsObservers(): void {
    let contacts: any[] = [];
    this.labelService.updateLabelCount(this.contacts);

    if (_.has(this.filterOption, 'search')) {
      contacts = this.searchContact(this.filterOption.search);
    } else if (_.has(this.filterOption, 'label')) {
      contacts = this.filterByLabel(this.filterOption.label);
    } else {
      contacts = this.contacts;
    }

    let orderedContacts: any[] = _.orderBy(contacts, ['name'], [this.orderDescSubject.getValue() ? 'asc' : 'desc']);
    let selectedIds: any[] = _.map(this.selectedObjects, 'uuid');
    let orderedContactsWSelected: any[] = _.map(orderedContacts, (ct: any) => {
      if (selectedIds.indexOf(ct.uuid) > -1)
        return Object.assign(ct, {selected: true});
      else
        return Object.assign(ct, {selected: false});
    });

    this.contactsSubject.next(orderedContactsWSelected.slice(this.startIndex, this.page * this.ITEM_PER_PAGE));
    this.checkSelectAll();
  }

  mergeDuplicateContacts(contacts: any[] = this.selectedObjects): Promise<any> {
    let ids: any[] = _.map(contacts, 'id');
    return this.apiBaseService.post(`${this.url}/merge_duplicate`, {ids: ids}).toPromise()
      .then((res: any) => {
        let delete_ids: any[] = res.delete_ids;
        let updated_contacts: any[] = res.data;
        _.remove(this.contacts, (c: any) => delete_ids.indexOf(c.id) > -1);
        _.remove(this.selectedObjects, (c: any) => delete_ids.indexOf(c.id) > -1);

        for (let i = 0; i < updated_contacts.length; i++) {
          let idx: any = _.findIndex(this.contacts, ['id', updated_contacts[i].id]);
          _.set(this.contacts, idx, updated_contacts[i]);
        }
        console.log('merge duplicate contacts, updated: ', this.contacts, updated_contacts, delete_ids);
        this.notifyContactsObservers();
        this.labelService.updateLabelCount(this.contacts);
      });
  }

  public initialLoad(): Promise<any> {
    if (this.initLoadSubject.getValue() === true) {
      this.initLoadSubject.next(true);
      return Promise.resolve(this.contacts);
    }
    return this.getAll().toPromise()
      .then((res: any) => {
        // this.contacts.push(...res.data);
        this.contacts = res.data;
        this.notifyContactsObservers();
        this.initLoadSubject.next(true);
        this.nextLink = _.get(res, 'page_metadata.links.next');
        this.followingLoad(this.nextLink);
      });
  }

  private searchContact(name: string): any[] {
    let search_value = name.toLowerCase();
    if (search_value === '') {
      return this.contacts;
    }
    let contacts = _.filter(this.contacts, (contact: any)=> {
      let emails_string: string = _.map(contact.emails, 'value').join(', ');
      let phones_string: string = _.map(contact.phones, 'value').join(', ');
      if ((contact.name.toLowerCase().indexOf(search_value) > -1)
        || (emails_string.toLowerCase().indexOf(search_value) > -1)
        || (phones_string.toLowerCase().indexOf(search_value) > -1)
      ) {
        return contact;
      }
    });

    return contacts;
  }

  private deleteSelectedContacts(contacts: any[] = this.selectedObjects): Promise<any> {
    let body = {contacts: contacts};
    return this.apiBaseService.post(`${this.url}/multi_destroy`, body).toPromise()
      .then(() => {
        let deletedIds = _.map(contacts, (contact: any) => contact.id);

        _.remove(this.contacts, (ct: any) => deletedIds.indexOf(ct.id) > -1);
        this.notifyContactsObservers();
        contacts.length = 0;
      });
  }

  private followingLoad(url: string) {
    if (!_.isEmpty(url))
      this.apiBaseService.get(url).toPromise()
        .then((res: any) => {
          this.contacts.push(...res['data']);
          this.nextLink = _.get(res, 'page_metadata.links.next');
          this.followingLoad(this.nextLink);
        });
    else
      this.notifyContactsObservers();
  }

  private createCallback(contact: any): void {
    this.contacts.unshift(contact);
    this.notifyContactsObservers();
  }

  private updateCallback(contact: any): void {
    this.contacts = _.map(this.contacts, (ct: any) => {
      if (contact.id === ct.id)
        return contact;
      else
        return ct;
    });

    _.forEach(this.selectedObjects, (selected: any, index: number) => {
      if (contact.id === selected.id) {
        this.selectedObjects[index] = contact;
        return;
      }
    });

    this.notifyContactsObservers();
  }

  private deleteCallback(contact: any) {
    _.remove(this.contacts, (ct: any) => {
      ct.id === contact.id;
    });
    this.notifyContactsObservers();
  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
