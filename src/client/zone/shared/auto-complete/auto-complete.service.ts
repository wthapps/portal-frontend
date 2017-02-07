import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ZSharedAutoCompleteService {

  constructor(private http: Http) {
  }

  getCountries() {
    return this.http.get('/api/countries/index.json')
      .toPromise()
      .then(res => <any[]> res.json())
      .then(data => {
        return data;
      });
  }
}
