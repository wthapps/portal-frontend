import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';


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
import { _wu } from '../../../core/shared/utils/utils';
import { LabelService } from '../../label/label.service';

declare var _: any;

@Injectable()
export class ZContactService extends BaseEntityService<any> {
  selectedObjects: any[] = [];
  contacts: Array<any> = new Array<any>();
  page: number = 1;

  // orderDesc: boolean = false;
  readonly startIndex: number = 0;
  readonly ITEM_PER_PAGE: number = 20;

  private isSelectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private initLoadSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private orderDescSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();
  private filterOption: any = {};
  private nextLink: string;

  listenToList = this.listenToListSource.asObservable();
  listenToItem = this.listenToItemSource.asObservable();
  contacts$: Observable<any[]> = this.contactsSubject.asObservable();
  initLoad$: Observable<boolean> = this.initLoadSubject.asObservable();
  orderDesc$: Observable<boolean> = this.orderDescSubject.asObservable();
  isSelectAll$: Observable<boolean> = this.isSelectAllSubject.asObservable();


  constructor(protected apiBaseService: ApiBaseService,
              public importContactDataService: ContactImportContactDataService,
              public labelService: LabelService,
              private suggestService: SuggestionService,
              private toastsService: ToastsService,
              private confirmationService: ConfirmationService) {
    super(apiBaseService);
    this.url = 'contact/contacts';
    this.initialLoad();

    this.suggestService.input$.subscribe((input: any) => {
      let contacts: any[] = _.cloneDeep(this.searchContact(input));
      this.suggestService.setSuggestion(contacts);

      console.log('input: ', input, ' - result: ', contacts);
    });
  }

  getAllContacts() {
    return _.orderBy(this.contacts, ['name'], [ this.orderDescSubject.getValue() ? 'asc' : 'desc']);
  }

  resetPageNumber() {
    this.page = 1;
  }

  onLoadMore(orderDesc?: boolean) {

    this.page += 1;
    let order: boolean = orderDesc || this.orderDescSubject.getValue();
    if(order !== undefined)
      this.orderDescSubject.next(order);
    this.notifyContactsObservers();
  }

  changeSortOption(order?: string) {
    if(order === undefined)
      this.orderDescSubject.next(!this.orderDescSubject.getValue());
    else
      this.orderDescSubject.next((order !== 'asc'));

    this.notifyContactsObservers();
  }

  addMoreContacts(data: any[]) {
    this.contacts = _.uniqBy(_.flatten([this.contacts, data]), 'id');
    this.notifyContactsObservers();

    console.log('inside addMoreContacts: ', data, this.contactsSubject.getValue());
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
      this.confirmationService.confirm({
        message: `Are you sure you want to delete following ${contact_length} contacts:  ${contact_names} ?`,
        header: 'Delete Contacts',
        accept: () => {
          this.deleteSelectedContacts(contacts).then(() => {
            this.toastsService.success(`Delete ${contact_length} contacts successfully`);
            resolve();
          });
        }
      });
    });
  };

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
    let isSelectAll = _.isEqual(this.contactsSubject.getValue().map((c: any) => c.id).sort(), this.selectedObjects.map((c: any) => c.id).sort());
    // console.debug('checkSelectAll: ', isSelectAll, this.contactsSubject.getValue().sort(), this.selectedObjects.sort());
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
      .map(
        (res: any) => {
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
      .map(
        (res: any) => {
          this.createCallback(res.data);
          return res;
        }
      );
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
    let label=  _.get(options, 'label', 'undefined');
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
        if(_.indexOf(clabels, label) > -1)
          return contact;
      })
    }

    return contacts;
  }

  // Search by name, email, phone number
  search(options: any) {
    this.resetPageNumber();
    let search_value = _.get(options, 'search_value', '').trim().toLowerCase();
    this.filterOption = {'search': search_value};
    // let contacts = this.searchContact(search_value);

    this.notifyContactsObservers();
  }

  notifyContactsObservers(order: boolean = true): void {
    let contacts: any[] = [];
    this.labelService.updateLabelCount(this.contacts);

    if(_.has(this.filterOption, 'search')) {
      contacts = this.searchContact(this.filterOption.search);
    } else if(_.has(this.filterOption, 'label')) {
      contacts = this.filterByLabel(this.filterOption.label);
    } else {
      contacts = this.contacts;
    }

    let orderedContacts: any[];
    if(order)
      orderedContacts = _.orderBy(contacts, ['name'], [this.orderDescSubject.getValue() ? 'asc' : 'desc']);
    else
      orderedContacts = contacts;

    this.contactsSubject.next(orderedContacts.slice(this.startIndex, this.page * this.ITEM_PER_PAGE));
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
      };
    });

    return contacts;
  }

  private deleteContact(contact: any): Promise<any> {
    return super.delete(`${contact.id}`)
      .toPromise()
      .then((res: any) => {
        _.remove(this.contacts, (ct: any) => {ct.id === res.data.id ;});
        this.notifyContactsObservers();
      });
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

  public initialLoad(): Promise<any> {
    if(this.initLoadSubject.getValue() === true) {
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

  private followingLoad(url: string) {
    if(!_.isEmpty(url))
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
      if(contact.id === selected.id) {
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
