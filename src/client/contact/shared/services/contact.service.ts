import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';
import { ZContactThreeDotActionsService } from '../actions/three-dot-actions/contact-three-dot.service';
import { ZContactAddContactService } from '../modal/add-contact/add-contact.service';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Injectable()
export class ZContactService extends BaseEntityService<any>{
  selectedObjects: any = [];

  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();

  listenToList = this.listenToListSource.asObservable();
  listenToItem = this.listenToItemSource.asObservable();
  contacts$: Observable<Array<any>> = this.contactsSubject.asObservable();

  constructor(protected apiBaseService: ApiBaseService,
              public commonEventService: CommonEventService,
              public contactThreeDotActionsService: ZContactThreeDotActionsService,
              public contactAddContactService: ZContactAddContactService
  ) {
    super(apiBaseService);
    this.url = 'contact/contacts';
    this.initialLoad();
  }

  initialLoad() {
    this.getContactList().toPromise()
      .then((res: any) => { this.contactsSubject.next(this.contactsSubject.getValue().concat(res.data));
      console.debug('this.contactSubject: ', this.contactsSubject.getValue());
      });
  }

  addMoreContacts(data: any[]) {
    // _.uniqBy(_.flatten([this.post.photos, selectedPhotos]), 'id');
    // this.contactsSubject.next(_.uniqBy(_.flatten([this.contactsSubject.getValue(), data]), 'id'));

    this.contactsSubject.next(this.contactsSubject.getValue().concat(data));

    console.log('inside addMoreContacts: ', data, this.contactsSubject.getValue());
  }

  // Only load contact lists from DB once
  getContactList(): Observable<any> {
    return this.apiBaseService.get("contact/contacts");
  }

  deleteContact(contact: any): Observable<any> {
    return this.apiBaseService.delete(`contact/contacts/${contact.id}`)
      .map(() =>  this.contactsSubject.next(_.remove(this.contactsSubject.getValue(),
          (ct: any) => ct.id === contact.id)));
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

  updateContact(contact: any, data: any) {
    return this.apiBaseService.put(`contact/contacts/${contact.id}`, data);
  }

  addContact(data: any) {
    return this.apiBaseService.post(`contact/contacts`, data);
  }

  importGoogleContacts(data: any) {
    return this.apiBaseService.post(`contact/contacts/import_google_contacts`, data);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
