import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


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
  constructor(private http: HttpClient) {}

  /**F
   *
   * @returns {Observable<R>}
   */
  getInfo(): Observable<any> {
    return this.http
      .get('/api/zone/social/user/info.json')
      .pipe(map((res: any) => res.json()),
      catchError(this.handleError));
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = error.message
      ? error.message
      : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }
}
