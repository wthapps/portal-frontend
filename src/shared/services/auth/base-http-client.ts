import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class BaseHttpClient {
  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: string): Observable<T> {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: string): Observable<T> {
    return this.http.put<T>(url, body);
  }

  patch<T>(url: string, body: string): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

}
