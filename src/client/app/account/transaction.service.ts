import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { Http, Response }   from '@angular/http';
import { ApiBaseService }   from '../shared/services/apibase.service';

@Injectable()
export class TransactionService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(path: string): Observable<Response> {
    return super.get(path);
  }

  public get(path: string): Observable<Response> {
    return super.get(path);
  }
}


