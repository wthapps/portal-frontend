import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

export interface ICountry {
  name: string;
  dial_code: string;
  code: string;
}

@Injectable()
export class CountryService {
  private _productUrl = '/api/countries/index.json';

  constructor(private _http: Http) { }

  getCountries(): Observable<ICountry[]> {
    return this._http.get(this._productUrl)
      .map((response: Response) => <ICountry[]> response.json());
      //.do(data => console.log('All: ' +  JSON.stringify(data)));
      //.catch(this.handleError);
  }

  getCountry(code: string): Observable<ICountry> {
    return this.getCountries()
      .map((products: ICountry[]) => products.find(p => p.code === code));
  }

  // private handleError(error: Response) {
  //   console.error(error);
  //   return Observable.throw(error.json().error || 'Server error');
  // }
}
