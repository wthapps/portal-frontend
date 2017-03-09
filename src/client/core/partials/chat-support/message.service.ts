/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

declare var _: any;

@Injectable()
export class MessageService {


  constructor( private api: ApiBaseService) {
  }

  sendMessage(message: any): Observable<Response> {
    // if (message.type == 'text') {
      return this.api.post(`chat_support/messages`, message);
    // } else (message.type == 'file') {
    //   console.log('load file to server');
    //   // upload file to server
    // }
  }
}




