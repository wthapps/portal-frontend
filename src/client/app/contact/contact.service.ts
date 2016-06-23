import {Injectable}         from '@angular/core';
import {Response}           from '@angular/http';

import {Observable}         from 'rxjs/Observable';

import {ApiBaseService}     from '../shared/services/apibase.service';

export const DNS_RECORD_URL = 'feedbacks/';

@Injectable()
export class ContactService {

  constructor(private _service: ApiBaseService) {}

  public createFeedback(body: string) {
    return this._service.post(DNS_RECORD_URL, body)
      .map(response => response.json())
      .catch(this.handleError);;
  }

  private handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
