import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators/map';

import { GroupService } from '../../group/group.service';
import { Router } from '@angular/router';
import { BaseEntityService } from '../../../shared/services/base-entity-service';
import { ToastsService } from '../../../shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '../../../shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@wth/shared/services';
import { _wu } from '@wth/shared/shared/utils/utils';
import { DEFAULT_SETTING } from '@contacts/shared/config/constants';
import { Contact } from '@contacts/contact/contact.model';

declare var _: any;
declare var Promise: any;
export const ITEM_PER_PAGE = 50;
export const OTHER_CONTACTS = 'others';
export const MY_CONTACTS = 'contacts';

@Injectable()
export class ZContactService extends BaseEntityService<any> {
  selectedObjects: any[] = [];
  contacts: Array<any> = new Array<any>();
  mergingObjects: any[] = [];
  mergedObjects: any[] = [];
  page = 1;
  userSettings: any = DEFAULT_SETTING;

  // orderDesc: boolean = false;
  readonly startIndex: number = 0;

  listenToList: any;
  listenToItem: any;
  contacts$: Observable<any[]>;
  initLoad$: Observable<boolean>;
  orderDesc$: Observable<boolean>;
  isSelectAll$: Observable<boolean>;

  private currentPage = 'contacts'; // 'others' || 'contacts'
  private isSelectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private initLoadSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(
    false
  );
  private orderDescSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(
    true
  );
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();
  private filterOption: any = {};
  private nextLink: string;

  constructor(
    protected apiBaseService: ApiBaseService,
    public groupService: GroupService,
    private toastsService: ToastsService,
    public router: Router,
    private wthConfirmService: WthConfirmService
  ) {
    super(apiBaseService);
    this.url = 'contact/contacts';

    this.listenToList = this.listenToListSource.asObservable();
    this.listenToItem = this.listenToItemSource.asObservable();
    this.contacts$ = this.contactsSubject.asObservable();
    this.initLoad$ = this.initLoadSubject.asObservable();
    this.orderDesc$ = this.orderDescSubject.asObservable();
    this.isSelectAll$ = this.isSelectAllSubject.asObservable();

    this.syncSelectedContacts();
  }

  get myContactCount(): number {
    return this.contacts.filter(contact => contact.my_contact === true).length;
  }

  get otherContactCount(): number {
    return this.contacts.filter(contact => contact.my_contact === false).length;
  }

  get myContacts(): Array<any> {
    return this.contacts.filter(contact => contact.my_contact === true);
  }

  get otherContacts(): Array<any> {
    return this.contacts.filter(contact => contact.my_contact === false);
  }

  setCurrentPage(page: string): void {
    this.currentPage = page;
  }

  syncSelectedContacts(): void {
    this.contactsSubject.subscribe((contacts: Contact[]) => {
      if(contacts.length === 0 )
        this.selectedObjects.length = 0;
      else {
        const contactIds = contacts.map(ct => ct.id);
        this.selectedObjects = this.selectedObjects.filter(o => contactIds.includes(o.id));
      }
      this.checkSelectAll();
    })
  }

  // Change get all URL to support caching by SW
  getAll(options?: any, url?: any): Observable<any> {
    const path = url || `${this.url}/all`;
    return this.apiBaseService.post(path, options);
  }

  loadUserSetttings(): Promise<any> {
    return this.apiBaseService
      .get(`contact/contacts/settings`)
      .toPromise()
      .then((res: any) => {
        this.userSettings = res.data;
      });
  }

  resetPageNumber() {
    this.page = 1;
  }

  getLocalContact(id): Promise<any> {
    const contact = this.contacts.find(ct => ct['id'] === id.toString());
    return Promise.resolve(contact);
  }

  getIdLocalThenNetwork(id): Observable<any> {
    return Observable.create((obs) => {
      this.getLocalContact(id).then(res => {
        if (res) {
          obs.next(res);
        }
        return this.get(id).toPromise();
      })
        .then((response: any) => {
          if (response.data) {
            obs.next(response.data);
          }
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  checkEmails(payload: any) {
    return this.apiBaseService.post(`contact/contacts/check_emails`, payload);
  }

  changeSortOption(order?: string) {
    if (order === undefined) {
      this.orderDescSubject.next(!this.orderDescSubject.getValue());
    } else {
      this.orderDescSubject.next(order !== 'asc');
    }

    this.notifyContactsObservers();
  }

  addMoreContacts(data: any[]) {
    this.contacts.push(...data);
    this.notifyContactsObservers();
  }

  delete(contact: any): Observable<any> {
    return super.delete(`${contact.id}`)
      .pipe(
        map((response: any) => {
          this.deleteCallback(response.data);
        })
      );
  }

  confirmDeleteContacts(contacts: any[] = this.selectedObjects): Promise<any> {
    const contact_names: string = contacts.reduce((acc, ct) => (ct.name.trim().length
    ? `${acc},${ct.name}` : acc), '').substring(1, 300).concat(' ...');
    const contact_length: number = contacts.length;
    return new Promise(resolve => {
      this.wthConfirmService.confirm({
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        message: `Are you sure to delete following ${contact_length} contact(s)? <br/> ${contact_names}`,
        header: 'Delete Contacts',
        accept: () => {
          this.deleteSelectedContacts(contacts).then(() => {
            this.toastsService.success(
              `Delete ${contact_length} contacts successfully`
            );
            resolve();
            this.router.navigate(['contacts']);
          });
        }
      });
    });
  }

  addItemSelectedObjects(item: any): void {
    this.selectedObjects.push(item);
    this.checkSelectAll();
  }

  removeItemSelectedObjects(item: any): void {
    _.remove(this.selectedObjects, {
      uuid: item.uuid
    });
    this.checkSelectAll();
  }

  toggleSelectedObjects(item: any) {
    const index = _.findIndex(this.selectedObjects, ['id', item.id]);
    if (index >= 0) {
      _.remove(this.selectedObjects, {
        uuid: item.uuid
      });
    } else {
      this.selectedObjects.push(item);
    }
    this.checkSelectAll();
    return !(index >= 0);
  }

  isSelectAll(): boolean {
    return this.isSelectAllSubject.getValue();
  }

  checkSelectAll(): void {
    const isSelectAll =
    this.inOtherPage() ?
      this.otherContactCount <= this.selectedObjects.length :
      this.contactsSubject.getValue().length <= this.selectedObjects.length;
    this.isSelectAllSubject.next(isSelectAll);
  }

  clearSelected(): void {
    // this.selectedObjects.length = 0;
    this.selectAllObjects(false);
  }

  toggleSelectAll(): void {
    this.selectAllObjects(!this.isSelectAll());
    this.notifyContactsObservers();
  }

  selectAllObjects(selected: boolean): void {
    if (!selected) {
      this.selectedObjects.length = 0;
    } else if (_.get(this.filterOption, 'search') || _.get(this.filterOption, 'group')) {
      this.selectedObjects = [...this.contactsSubject.getValue()];
    } else {
      this.selectedObjects = this.inOtherPage() ? [...this.otherContacts] : [...this.myContacts];
    }
  }

  sendListToItem(event: any) {
    this.listenToListSource.next(event);

    this.isSelectAllSubject.next(!this.isSelectAllSubject.getValue());
  }

  viewContactDetail(contact: Contact): Promise<any> {
    return this.router.navigate(['contacts', contact.id, 'view']);
  }

  updateMultiple(body: any): Observable<any> {
    return this.apiBaseService
      .post(`${this.url}/update_multiple`, body)
      .pipe(
        map((response: any) => {
          const contacts = response.data;
          contacts.forEach(this.updateCallback.bind(this));
          return response;
        })
      );
  }

  updateSingle(body: any): Observable<any> {
    return super.update(body)
      .pipe(
        map((res: any) => {
          this.updateCallback(res.data);
          return res;
        })
      );
  }

  update(data: any): Observable<any> {
    if (data && _.isArray(data)) {
      if (data.length > 1) {
        return this.updateMultiple({ contacts: data });
      } else {
        return this.updateSingle(data[0]);
      }
    } else {
      return this.updateSingle(data);
    }
  }

  create(body: any): Observable<any> {
    return super.create(body)
      .pipe(
        map((res: any) => {
          this.createCallback(res.data);
          return res;
        })
      );
  }

  import(payload: any): Observable<any> {
    return this.apiBaseService.post(`${this.url}/import`, payload);
  }

  addContact(data: any): Promise<any> {
    return this.apiBaseService
      .post(`${this.url}`, data)
      .toPromise()
      .then((res: any) => this.createCallback(res.data));
  }

  getGoogleApiConfig() {
    return this.apiBaseService.get(`${this.url}/get_google_api_config`);
  }

  filter(options: any) {
    this.resetPageNumber();
    this.filterOption = options;
    this.notifyContactsObservers();
  }

  filterByGroup(options: any) {
    let contacts: any[] = [];
    const category = options.category || 'myContacts';
    const group = options.group || 'undefined';

    if (group === undefined || group === 'undefined') {
      contacts = category === 'others' ? this.contacts.filter(contact => !contact.my_contact) :
                                        this.contacts.filter(contact => contact.my_contact);
    } else {
      contacts = _.filter(this.contacts, (contact: any) => {
        const cgroups = _.map(contact.groups, 'name');
        if (_.indexOf(cgroups, group) > -1) return contact;
      });
    }

    return contacts;
  }

  // Search by name, email, phone number
  search(options: any) {
    this.resetPageNumber();
    const search_value = _.get(options, 'search_value', '')
      .trim()
      .toLowerCase();
    this.filterOption = { search: search_value };

    this.notifyContactsObservers();
  }

  resetSelectedObjects() {
    this.selectedObjects.length = 0;
    this.notifyContactsObservers();
  }

  notifyContactsObservers(): void {
    let contacts: any[] = [];
    this.groupService.updateGroupCount(this.contacts);

    console.log('this filter options:::', this.filterOption);
    if (_.get(this.filterOption, 'search')) {
      contacts = this.searchContact(this.filterOption.search);
    } else if (_.has(this.filterOption, 'group')) {
      contacts = this.filterByGroup(this.filterOption);
    } else {
      contacts = this.inOtherPage() ? this.otherContacts : this.myContacts;
    }

    const orderedContacts: any[] = contacts.sort((a, b) => _wu.compareBy(a, b, this.orderDescSubject.getValue()));
    const selectedIds: any[] = _.map(this.selectedObjects, 'uuid');

    const orderedContactsWSelected: any[] = orderedContacts.map(ct => {
      return { ...ct, selected: selectedIds.includes(ct.uuid) };
    });

    this.contactsSubject.next(
      orderedContactsWSelected
    );
    this.checkSelectAll();
  }

  inOtherPage(): boolean {
    return this.currentPage === OTHER_CONTACTS;
  }

  sendRequest(contact: any) {
    this.apiBaseService
      .post(`${this.url}/send_connect_request`, contact)
      .toPromise()
      .then(res => {
        this.toastsService.success(`You sent connection request successfully`);
        this.updateCallback(res.data);
      })
      .catch(err => console.error(err));
  }

  mergeContacts(contacts: any[] = this.selectedObjects): Promise<any> {
    const ids: any[] = _.map(contacts, 'id');
    this.mergingObjects = [...contacts];
    return this.apiBaseService
      .post(`${this.url}/merge_contacts`, { ids })
      .toPromise()
      .then((res: any) => {
        const merged_contact: any = { ...res.data };
        this.contacts = this.contacts.filter((c: any) => !ids.includes(c.id));
        this.selectedObjects.length = 0;
        this.mergedObjects = [merged_contact];

        this.contacts.unshift(merged_contact);
        this.notifyContactsObservers();
        this.groupService.updateGroupCount(this.contacts);
      });
  }

  undoMerge(contacts: any[] = this.mergingObjects, mergedContacts: any[] = this.mergedObjects): Promise<any> {
    const restore_ids = contacts.map(ct => ct.id);
    const remove_ids = mergedContacts.map(ct => ct.id);
    return this.apiBaseService
      .post(`${this.url}/undo_merge`, { restore_ids, remove_ids })
      .toPromise()
      .then((res: any) => {
        const restoredContacts = res.data;
        this.selectedObjects.length = 0;
        this.contacts = [...this.contacts.filter(ct => !remove_ids.includes(ct.id)), ...restoredContacts];
        this.notifyContactsObservers();
      });
  }

  initialLoad(): Promise<any> {
    if (this.initLoadSubject.getValue() === true) {
      this.initLoadSubject.next(true);
      return Promise.resolve(this.contacts);
    }
    return this.getAll()
      .toPromise()
      .then((res: any) => {
        this.contacts = res.data;
        this.notifyContactsObservers();
        this.initLoadSubject.next(true);
        this.nextLink = _.get(res, 'meta.links.next');
        this.followingLoad(this.nextLink);
      });
  }

  setUserSettings(settings) {
    this.userSettings = settings;
  }

  get defaultCountryCode() {
    return this.userSettings.phone_default_code;
  }

  searchContact(name: string): any[] {
    const search_value = name.toLowerCase();
    if (search_value === '') {
      return this.contacts;
    }
    const contacts = _.filter(this.contacts, (contact: any) => {
      const emails_string: string = _.map(contact.emails, 'value').join(', ');
      const phones_string: string = _.map(contact.phones, 'value').join(', ');
      if (
        contact.name.toLowerCase().indexOf(search_value) > -1 ||
        emails_string.toLowerCase().indexOf(search_value) > -1 ||
        phones_string.toLowerCase().indexOf(search_value) > -1
      ) {
        return contact;
      }
    });

    return contacts;
  }

  private deleteSelectedContacts(
    contacts: any[] = this.selectedObjects
  ): Promise<any> {
    const body = { contacts: contacts };
    return this.apiBaseService
      .post(`${this.url}/multi_destroy`, body)
      .toPromise()
      .then(() => {
        const deletedIds = _.map(contacts, (contact: any) => contact.id);

        _.remove(this.contacts, (ct: any) => deletedIds.indexOf(ct.id) > -1);
        this.notifyContactsObservers();
        contacts.length = 0;
      });
  }

  private followingLoad(url: string) {
    if (!_.isEmpty(url))
      this.apiBaseService
        .post(url)
        .toPromise()
        .then((res: any) => {
          this.contacts.push(...res['data']);
          this.nextLink = _.get(res, 'meta.links.next');
          this.followingLoad(this.nextLink);
        });
    else this.notifyContactsObservers();
  }

  createCallback(contact: any): void {
    this.contacts.unshift(contact);
    this.notifyContactsObservers();
  }

  private updateCallback(contact: any): void {
    if (contact && contact.length === 0)
      return;
    this.contacts = _.map(this.contacts, (ct: any) => {
      if (contact.id === ct.id) return contact;
      else return ct;
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
    _.remove(this.contacts, (ct: any) => ct.id === contact.id);
    _.remove(this.selectedObjects, (ct: any) => ct.id === contact.id);
    this.notifyContactsObservers();
  }
}
