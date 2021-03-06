import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs';

export class BaseEntityService<T> {
  url = '';

  constructor(protected apiBaseService: ApiBaseService) {}

  getAll(options?: any, url?: any): Observable<any> {
    const path = url || this.url;
    return this.apiBaseService.get(path, options);
  }

  get(id: number, path: string = ''): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    return this.apiBaseService.get(`${url}/${id}`);
  }

  create(body: any, multiple: boolean = false): Observable<any> {
    if (multiple) {
      // this case body MUST be an array
      const payload = { payload: body, multiple: true };
      return this.apiBaseService.post(this.url, payload);
    } else {
      return this.apiBaseService.post(this.url, body);
    }
  }

  update(
    body: any,
    multiple: boolean = false,
    path: string = ''
  ): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    if (multiple) {
      return this.apiBaseService.put(`${url}/multiple`, body);
    } else {
      return this.apiBaseService.put(`${url}/${body.id}`, body);
    }
  }

  updateMany(payload: any, path: string = ''): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    return this.apiBaseService.post(`${url}/update_many`, payload);
  }

  delete(id: any, payload?: any, path: string = ''): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    if (id === 0) {
      return this.apiBaseService.post(`${url}/0`, {
        multiple: true,
        payload: payload
      });
    } else {
      return this.apiBaseService.delete(`${url}/${id}`);
    }
  }

  deleteMany(payload?: any, path: string = ''): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    return this.apiBaseService.post(`${url}/delete_many`, { ...payload });
  }
}
