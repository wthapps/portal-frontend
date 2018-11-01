import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';


export class CountryModel {
  name: string;
  dial_code: string;
  code: string;
}

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class WCountriesService {
  countriesCode$: Observable<CountryModel[]>;
  private countriesCodeSubject: BehaviorSubject<CountryModel[]> = new BehaviorSubject<CountryModel[]>(null);

  /**
   * Creates a new CountryService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: HttpClient) {
    this.countriesCode$ = this.countriesCodeSubject.asObservable();
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  getCountries(): Observable<CountryModel[]> {
    return this.http.get('assets/data/countries.json')
      .pipe(
        map((res: any) => {
          return res.map((v: any) => {
            return {
              // ...v,
              value: v.name + ' (' + v.dial_code + ')',
              label: v.name + ' (' + v.dial_code + ')',
              code: v.code.toLowerCase()
            };
          });
        }),
        tap((res: any) => {
          this.countriesCodeSubject.next(res);
        })
      );
  }
}

