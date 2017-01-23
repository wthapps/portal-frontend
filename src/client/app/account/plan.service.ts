import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { ApiBaseService } from '../shared/services/apibase.service';
import { Router }         from '@angular/router';


@Injectable()
export class PlanService extends ApiBaseService {

  constructor(http: Http, router: Router) {
    super(http, router);
  }

  public list(path: string): Observable<Response> {
    return super.get(path);
  }
}
