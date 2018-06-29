import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {throwError as observableThrowError,  Observable ,  BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';




declare var _: any;

export class ICountry {
  name: string;
  dial_code: string;
  code: string;
}

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class CountryService {

  public countriesCode$: Observable<any>;
  private countriesCodeSubject: BehaviorSubject<ICountry[]> = new BehaviorSubject<ICountry[]>([]);

  /**
   * Creates a new CountryService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {
    this.countriesCode$ = this.countriesCodeSubject.asObservable();
    this.initialLoad();
  }


  initialLoad() {
    this.getCountries().toPromise()
      .then((data: any[]) => { this.countriesCodeSubject.next(data);});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  getCountries(): Observable<any> {
    if (this.countriesCodeSubject.getValue().length > 1)
      return this.countriesCode$;

    return this.http.get('assets/data/countries.json').pipe(catchError(this.handleError));
  }

  getCountry(code: string): Observable<ICountry> {
    return this.getCountries().pipe(
      map((products: ICountry[]) => products.find(p => p.code === code)),
      catchError(this.handleError));
  }

  getCountryNameToCode(name: any, dataCountries: any) {
    if (dataCountries) {
      let phoneName = name.split(' (+');
      let phoneCode = _.find(dataCountries, ['name', phoneName[0]]);
      return phoneCode.code;
    } else {
      return name;
    }
  }

  getCountryCodeToName(code: any, dataCountries: any) {
    if (dataCountries) {
      let objName = _.find(dataCountries, ['code', code]);
      return objName.name + ' (' + objName.dial_code + ')';
    } else {
      return name;
    }
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}

