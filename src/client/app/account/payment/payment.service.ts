import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { ApiBaseService } from '../../shared/services/apibase.service';

@Injectable()
export class PaymentService {

  constructor(private api: ApiBaseService) {

  }
  create(path: string, body: string): Observable<Response> {
    return this.api.post(path, body)
  }

  update(path: string, body: string): Observable<Response> {
    return this.api.patch(path, body)
  }

  get_client_token(path: string): Observable<Response> {
    return this.api.get(path)
  }

  delete(path: string): Observable<Response> {
    return this.api.delete(path)
  }
}
