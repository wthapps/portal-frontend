import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs/Observable';


export class BaseEntityService<T> {

  url = '';

  constructor(protected api: ApiBaseService) {

  }

  getAll(options?: any): Observable<any> {
    return this.api.get(this.url, options);
  }

  get(id: number): Observable<any> {
    return this.api.get(`${this.url}/${id}`);
  }

  create(body: any): Observable<any> {
    return this.api.post(this.url, body);
  }

  update(body: any): Observable<any> {
    return this.api.put(`${this.url}/${body.id}`, body);
  }

  delete(id: any): Observable<any> {
    return this.api.delete(`${this.url}/${id}`);
  }
}
