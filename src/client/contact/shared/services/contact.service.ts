import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';
import { ZContactThreeDotActionsService } from '../three-dot-actions/contact-three-dot.service';

declare var _: any;

@Injectable()
export class ZContactService {
  selectedObjects: any = [];

  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();

  listenToList = this.listenToListSource.asObservable();
  listenToItem = this.listenToItemSource.asObservable();


  constructor(private apiBaseService: ApiBaseService,
              public contactThreeDotActionsService: ZContactThreeDotActionsService) {

  }

  getContactList(): Observable<any> {
    return this.apiBaseService.get("contact/contacts");
  }

  deleteContact(contact: any): Observable<any> {
    return this.apiBaseService.delete(`contact/contacts/${contact.id}`);
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


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
