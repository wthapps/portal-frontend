import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {ApiBaseService} from '../shared/services/apibase.service';

@Injectable()
export class PaymentService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  public create(path: string, body: string): Observable<Response> {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          //update credit cards for current user

        }
        return res;
      });
  }

  public update(path: string, body: string): Observable<Response> {
    return super.patch(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          //update credit cards for current user

        }
        return res;
      });
  }

  public get_client_token(path: string): Observable<Response> {
    return super.get(path)
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  public delete(path: string): Observable<Response> {
    return super.delete(path)
      .map(res => res.json())
      .map((res) => {
        if (res) {

        }
        return res;
      });
  }
}
