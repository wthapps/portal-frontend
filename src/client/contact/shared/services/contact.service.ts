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
  contacts: Array<any> = new Array<any>();

  private contactsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();

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

  addMoreContacts(data: any[]) {
    this.contacts = _.uniqBy(_.flatten([this.contacts, data]), 'id');
    this.contactsSubject.next(this.contacts);

    console.log('inside addMoreContacts: ', data, this.contactsSubject.getValue());
  }

  delete(contact: any): Observable<any> {
    return super.delete(`${contact.id}`)
      .map((response: any) => {
        this.deleteCallback(response.data);
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

  update(body: any): Observable<any> {
    return super.update(body)
      .map(
        (res: any) => {
          this.updateCallback(res.data);
          return res;
        }
      );
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

  importGoogleContacts(data: any) {
    return this.apiBaseService.post(`${this.url}/import_google_contacts`, data);
  }

  getGoogleApiConfig() {
    return this.apiBaseService.get(`${this.url}/get_google_api_config`);
  }

  filter(options: any): Array<any> {
    return _.filter(this.contacts, (contact: any)=> {
      if (options.label != 'undefined') {
        return _.find(contact.labels, (label: any) => {
          if(label.name === options.label) {
            return contact;
          };
        });
      }
    });
  }

  private initialLoad() {
    this.getAll().toPromise()
      .then((res: any) => {
        this.contacts.push(...res.data);
        this.contactsSubject.next(this.contacts);
        // console.debug('this.contactSubject: ', this.contacts, this.contactsSubject.getValue());
      });
  }

  private createCallback(contact: any): void {
    this.contacts.unshift(contact);
    this.contactsSubject.next(this.contacts);
  }

  private updateCallback(contact: any): void {
    _.set(this.contacts, contact.id, contact.data);
    this.contactsSubject.next(this.contacts);
  }

  private deleteCallback(contact: any) {
    _.remove(this.contacts, (ct: any) => {ct.id === contact.id ;});
    this.contactsSubject.next(this.contacts);
  }



  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
