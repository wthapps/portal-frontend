import { Injectable } from '@angular/core';

import { ApiBaseService } from '../../shared/services/apibase.service';

@Injectable()
export class AboutService {
  url: string = 'feedbacks/';

  constructor(private apiBaseService: ApiBaseService) {
  }

  createFeedback(body: any): any {
    return this.apiBaseService.post(`${this.url}`, body);
  }
}
