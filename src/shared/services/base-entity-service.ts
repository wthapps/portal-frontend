import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs/Observable';


export class BaseEntityService<T> {

  url = '';

  constructor(protected apiBaseService: ApiBaseService) {

  }

  getAll(options?: any): Observable<any> {
    return this.apiBaseService.get(this.url, options);
  }

  get(id: number): Observable<any> {
    return this.apiBaseService.get(`${this.url}/${id}`);
  }

  create(body: any, multiple: boolean=false): Observable<any> {
    if(multiple) {
      // this case body MUST be an array
      let payload = {payload: body, multiple: true};
      return this.apiBaseService.post(this.url, payload);
    } else {
      return this.apiBaseService.post(this.url, body);
    }
  }

  update(body: any, multiple: boolean=false): Observable<any> {
    if(multiple) {
      return this.apiBaseService.put(`${this.url}/multiple`, body);
    } else {
      return this.apiBaseService.put(`${this.url}/${body.id}`, body);
    }
  }

  delete(id: any, payload?: any): Observable<any> {
    if(id == 0) {
      return this.apiBaseService.post(`${this.url}/0`, {multiple: true, payload: payload});
    } else {
      return this.apiBaseService.delete(`${this.url}/${id}`);
    }
  }
}
