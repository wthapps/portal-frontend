import { Injectable } from "@angular/core";
import { ApiBaseService } from "@shared/services";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ApiProxyService extends ApiBaseService {

  call(method: string, path: string, body: any = '', options: any = {}): Observable<any> {
    return this.http.get(`assets/test/${path}_${method}.json`)
      .take(1)
      .catch(this.handleError);
  }
}
