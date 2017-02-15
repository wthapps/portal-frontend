import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/**
 * This class provides the ZSocialProfileService service with methods to read info and add info.
 */
@Injectable()
export class ZSocialProfileService {

  /**
   * Creates a new CountryService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   *
   * @returns {Observable<R>}
   */
  getInfo(): Observable<any> {
    return this.http.get('/api/zone/social/user/info.json')
      .map((res: Response) => res.json())
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

