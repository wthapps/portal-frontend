import {Injectable}         from '@angular/core';
import {Response}           from '@angular/http';

import {Observable}         from 'rxjs/Observable';

import {IRecord}            from './record';
import {ApiBaseService}     from '../../../shared/services/apibase.service';
import {UserService}        from '../../../shared/services/user.service';

export const DNS_RECORD_URL = 'dns/records/';

export const HTTP_RESPONSE_OK                    = 200;
export const HTTP_RESPONSE_NOT_FOUND             = 404;
export const HTTP_RESPONSE_INTERNAL_SERVER_ERROR = 500;
export const HTTP_RESPONSE_CREATED               = 201;
export const HTTP_RESPONSE_CONFLICT              = 409;
export const HTTP_RESPONSE_EXPECTATION_FAILED    = 417;

export class Logger {
  private static INFO:string  = '[INFO]';
  private static DEBUG:string = '[DEBUG]';
  private static ERROR:string = '[ERROR]';
  private static WARN:string  = '[WARN]';

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

  constructor(private _service: ApiBaseService, private _userService: UserService) {
    this._userId = this._userService.profile.id;
    this._url = `users/${this._userId}/dns/records/`;
  }

  public getHosts():Observable<IRecord[]> {
    return this._service.get(this._url)
      .map((response:Response) => {
        if (response.status == HTTP_RESPONSE_OK || response.status == HTTP_RESPONSE_CREATED) {
          let result = response.json();
          if (result.data == 'empty')
          {
            return [];
          }
          console.log(JSON.stringify(result.data));
          var list = <IRecord[]>result.data;
          for (var i in list) {
            let current = list[i];
            current.updated_at = new Date(current.updated_at.toString());
          }
          return list;
        }
        return [];
      })
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  /*public addHost(body:string) {
    console.log(this._url);
    console.log(body);
    return this._service.post(this._url, body)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }*/
  public addHost(body:string) {
    console.log(this._url);
    console.log(body);
    return this._service.post(this._url, body);
  }


  public deleteHost(id:number) {
    return this._service.delete(this._url + id)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  /*public updateHost(body:string, id: number) {
    return this._service.patch(this._url + id, body)
      .map(response => response.json())
      .do(data => Logger.Info('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }*/
  public updateHost(body:string, id: number) {
    return this._service.patch(this._url + id, body);
  }


  public getHost(id:number) {
    return this._service.get(this._url + id)
      .map(response => {
        if (response.status == HTTP_RESPONSE_OK) {
          let result = response.json();
          return <IRecord>result.data;
        }
        return new IRecord();
      })
      .do(data => Logger.Info('JSON data get Host: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    /*console.log(error.status);
    if (error.status === HTTP_RESPONSE_CONFLICT) {
      return Observable.throw(error.json().error || 'Hostname has already been taken');
    }*/
    return Observable.throw(error.json().error || 'Server error');
  }

  private _userId: number = 0;
  private _url: string = '';
}
