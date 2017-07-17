import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';
import { ZContactThreeDotActionsService } from '../actions/three-dot-actions/contact-three-dot.service';
import { ZContactAddContactService } from '../modal/add-contact/add-contact.service';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { Constants } from '../../../core/shared/config/constants';
import { ContactImportContactDataService } from '../modal/import-contact/import-contact-data.service';

declare var _: any;

@Injectable()
export class ZContactService extends BaseEntityService<any>{
  selectedObjects: any = [];
  private allContacts: Array<any> = new Array([]);

  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();
  readonly contactsUrl: string = Constants.urls.contacts;

  listenToList = this.listenToListSource.asObservable();
  listenToItem = this.listenToItemSource.asObservable();
  contacts$: Observable<Array<any>> = this.contactsSubject.asObservable();

  constructor(protected apiBaseService: ApiBaseService,
              public importContactDataService: ContactImportContactDataService,
              public contactThreeDotActionsService: ZContactThreeDotActionsService,
              public contactAddContactService: ZContactAddContactService
  ) {
    super(apiBaseService);
    this.url = 'contact/contacts';
    this.initialLoad();
  }

  initialLoad() {
    this.getAll().toPromise()
      .then((res: any) => {
      this.allContacts.push(...res.data);
      this.contactsSubject.next(this.allContacts);
      console.debug('this.contactSubject: ', this.allContacts, this.contactsSubject.getValue());
      });
  }

  getAllContacts() {
    return this.contactsSubject.getValue();
  }

  addMoreContacts(data: any[]) {
    // _.uniqBy(_.flatten([this.post.photos, selectedPhotos]), 'id');
    // this.contactsSubject.next(_.uniqBy(_.flatten([this.contactsSubject.getValue(), data]), 'id'));

    this.allContacts = _.uniqBy(_.flatten([this.allContacts, data]), 'id');
    this.contactsSubject.next(this.allContacts);

    console.log('inside addMoreContacts: ', data, this.contactsSubject.getValue());
  }

  // // Only load contact lists from DB once
  // getContactList(): Observable<any> {
  //   return this.apiBaseService.get(this.contactsUrl);
  // }

  deleteContact(contact: any): Observable<any> {
    return super.delete(`${contact.id}`)
      .map(() => {
        _.remove(this.allContacts, (ct: any) => {ct.id === contact.id ;});
        this.contactsSubject.next(this.allContacts);
    });
  }

  addItemSelectedObjects(item: any) {
    this.selectedObjects.push(item);
  }

  removeItemSelectedObjects(item: any) {
    _.remove(this.selectedObjects, {
      'uuid': item.uuid
    });
  }

  sendListToItem(event: any) {
    this.listenToListSource.next(event);
  }

  sendItemToList(event: any) {
    this.listenToItemSource.next(event);
  }

  updateContact(contact: any, data: any): Promise<any> {
    return this.apiBaseService.put(`${this.contactsUrl}/${contact.id}`, data)
      .toPromise()
      .then((res: any) => this.updateEditedContact(res.data));
  }

  addContact(data: any): Promise<any> {
    return this.apiBaseService.post(`${this.contactsUrl}`, data).toPromise().then((res: any) => this.addNewContact(res.data));
  }

  importGoogleContacts(data: any) {
    return this.apiBaseService.post(`${this.contactsUrl}/import_google_contacts`, data);
  }

  getGoogleApiConfig() {
    return this.apiBaseService.get(`${this.contactsUrl}/get_google_api_config`);
  }

  private addNewContact(contact: any): void {
    this.allContacts.unshift(contact);
    this.contactsSubject.next(this.allContacts);
  }

  private updateEditedContact(contact: any): void {
    // _.map(this.allContacts, (old_contact: any) => {if(old_contact.id !== contact.id ) });
    _.set(this.allContacts, contact.id, contact.data);
    this.contactsSubject.next(this.allContacts);
    console.log('updateEditedContact: ', this.allContacts);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
