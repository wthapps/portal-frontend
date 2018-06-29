/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { ApiBaseService } from '../../../../services/apibase.service';

declare var _: any;

@Injectable()
export class ConversationService {


  constructor(private api: ApiBaseService) {
  }

  create(conversation: any): Observable<Response> {
    return this.api.post(`chat_support/conversations`, conversation);
  }
}




