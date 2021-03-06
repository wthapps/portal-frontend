import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { ApiBaseService } from '@wth/shared/services/apibase.service';

@Injectable()
export class MyPaymentService {
  constructor(private api: ApiBaseService) {}
  create(path: string, body: string): Observable<Response> {
    return this.api.post(path, body);
  }

  update(path: string, body: string): Observable<Response> {
    return this.api.patch(path, body);
  }

  get_client_token(path: string): Observable<Response> {
    return this.api.get(path);
  }

  delete(path: string): Observable<Response> {
    return this.api.delete(path);
  }
}
