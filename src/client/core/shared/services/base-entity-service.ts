import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs/Observable';


export class BaseEntityService<T> {

  items: T[];
  item: T;
  url = '';

  constructor(private api: ApiBaseService) {

  }

  getAll(options?: any): Observable<any> {
    return this.api.get(this.url, options);
  }

  get(id: number): Observable<any> {
    return this.api.get(this.url);
  }

  create(id: number): Observable<any> {
    return this.api.get(this.url);
  }

  update(id: number): Observable<any> {
    return this.api.get(this.url);
  }

  delete(id: number): Observable<any> {
    return this.api.get(this.url);
  }
}


