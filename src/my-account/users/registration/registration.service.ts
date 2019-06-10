import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '@shared/services';

@Injectable()
export class RegistrationService {

  path = 'v1/account/user/registrations';
  constructor(private apiBaseService: ApiBaseService) {

  }

  /*
   * `get registration` information.
   */
  get(confirmedToken: string): Observable<any> {
    return this.apiBaseService.get(`${this.path}/${confirmedToken}`);
  }

  create(body: string): Observable<any> {
    return this.apiBaseService.post(this.path, body, { unauthen: true });
  }

}
