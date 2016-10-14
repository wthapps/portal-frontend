import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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

  /**
   * Creates a new CountryService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  getCountries(): Observable<ICountry[]> {
    return this.http.get('/api/countries/index.json')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getCountry(code: string): Observable<ICountry> {
    return this.getCountries()
      .map((products: ICountry[]) => products.find(p => p.code === code))
      .catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

