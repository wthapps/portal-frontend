/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

declare var _: any;

@Injectable()
export class ConversationService {


  constructor( private api: ApiBaseService) {
  }

  create(conversation: any): Observable<Response> {
    return this.api.post(`chat_support/conversations`, conversation);
  }
}




