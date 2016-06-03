import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';

import {IRecord} from './record';
import {ApiBaseService}    from '../../../shared/services/apibase.service';

export const DNS_RECORD_URL = 'dns/records/';
export const HTTP_SUCCESS = 200;

export class Logger {
  private static INFO:string = '[INFO]';
  private static DEBUG:string = '[DEBUG]';
  private static ERROR:string = '[ERROR]';
  private static WARN:string = '[WARN]';

  public static Info(body:string) {
    console.info(this.INFO + body);
  }

  public static Warn(body:string) {
    console.warn(this.WARN + body);
  }

  public static Debug(body:string) {
    console.debug(this.DEBUG + body);
  }

  public static Error(body:string) {
    console.error(this.ERROR + body);
  }
}

@Injectable()
export class DnsService {

  constructor(private _service:ApiBaseService) {
  }

  public getHosts():Observable<IRecord[]> {
    return this._service.get(DNS_RECORD_URL)
      .map((response:Response) => {
        if (response.status == HTTP_SUCCESS) {
          let result = response.json();
          console.log(JSON.stringify(result.data));
          return <IRecord[]>result.data;
        }
        return [];
      })
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  public addHost(body:string) {
    return this._service.post(DNS_RECORD_URL, body)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  public deleteHost(id:number) {
    return this._service.delete(DNS_RECORD_URL + id)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  public updateHost(body:string) {
    return this._service.patch(DNS_RECORD_URL, body)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  public getHost(id:number) {
    return this._service.get(DNS_RECORD_URL + '/' + id)
      .map(response => {
        if (response.status == HTTP_SUCCESS) {
          let result = response.json();
          return <IRecord>result.data;
        }
        return new IRecord();
      })
      .do(data => Logger.Info('JSON data get Host: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    let bad = error.json().error;
    Logger.Error(bad);
    return Observable.throw(error.json().error || 'Server error');
  }
}
