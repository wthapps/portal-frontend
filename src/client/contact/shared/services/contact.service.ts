import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';

declare var _: any;

@Injectable()
export class ZContactService {
  selectedObjects: any = [];

  private apiUrl = '/api/zone/contact/user/info.json';

  private listenToListSource = new Subject<any>();
  private listenToItemSource = new Subject<any>();

  listenToList = this.listenToListSource.asObservable();
  listenToItem = this.listenToItemSource.asObservable();


  constructor(private http: Http, private apiBaseService: ApiBaseService) {

  }

  getContactList(): Observable<any[]> {
    // return this.apiBaseService.get(this.apiUrl)
    return this.http.get(this.apiUrl)
      .map((response: Response) => <any[]> response.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  deleteContact(contact: any): Observable<any[]> {
    // return this.apiBaseService.get(this.apiUrl)
    return this.http.get(this.apiUrl)
      .map((response: Response) => <any[]> response.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
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


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
