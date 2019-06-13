import { Injectable } from '@angular/core';

import { ApiBaseService } from '@shared/services/apibase.service';

@Injectable()
export class ContactUsService {
  readonly url = 'admin/contact_us/';

  constructor(private apiBaseService: ApiBaseService) {}

  create(body: any): any {
    return this.apiBaseService.post(`${this.url}`, {contact_us: body});
  }
}
