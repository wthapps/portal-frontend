import { Injectable }         from '@angular/core';

import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Injectable()
export class ContactService {
  url: string = 'feedbacks/';

  constructor(private apiBaseService: ApiBaseService) {
  }

  createFeedback(body: any): any {
    return this.apiBaseService.post(`${this.url}`, body);
  }
}
