import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Response, Http } from '@angular/http';

@Injectable()
export class ZContactService {

  private apiUrl = '/api/zone/contact/user/info.json';

  selectedObjects: any = [];

  constructor(private http: Http, private apiBaseService: ApiBaseService) {

  }

  getContactList(): Observable<any[]> {
    // return this.apiBaseService.get(this.apiUrl)
    return this.http.get(this.apiUrl)
      .map((response: Response) => <any[]> response.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
