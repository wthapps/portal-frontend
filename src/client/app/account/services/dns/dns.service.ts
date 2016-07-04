import {
  Injectable
}                           from '@angular/core';
import {
  Response
}                           from '@angular/http';

import {
  Observable
}                           from 'rxjs/Observable';

import {
  Record, 
  Product
}                           from './record';
import {
  ApiBaseService, 
  UserService, 
  HttpStatusCode
}                           from '../../../shared/index'

@Injectable()
export class DnsService {

  constructor(
    private _service: ApiBaseService, 
    private _userService: UserService) {}
  
  public getHosts():Observable<Record[]> {
    return this._service.get(`users/${this._userService.profile.id}/dns/records/`)
      .map((response:Response) => {
        
        let body = JSON.parse(response['_body']);

        if (response['status'] == HttpStatusCode.OK || 
            response['status'] == HttpStatusCode.Created) {
          if (body.data == 'empty') {
            return [];
          }
          var list = <Record[]>body.data;
          for (var i in list) {
            let current = list[i];
            current.updated_at = new Date(current.updated_at.toString());
          }
          return list;
        }
        return [];
      })
      .catch(this.handleError);
  }

  public addHost(body:string) {
    return this._service.post(`users/${this._userService.profile.id}/dns/records/`, body);
  }


  public deleteHost(id:number) {
    return this._service.delete(`users/${this._userService.profile.id}/dns/records/${id}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  public updateHost(body:string, id: number) {
    return this._service.patch(`users/${this._userService.profile.id}/dns/records/${id}`, body);
  }

  public getHost(id:number) {
    return this._service.get(`users/${this._userService.profile.id}/dns/records/${id}`)
      .map(response => {
        if (response['status'] == HttpStatusCode.OK) {
          let result = response.json();
          return <Record>result.data;
        }
        return new Record();
      })
      .catch(this.handleError);
  }

  public getProduct(id: number) {
    let product_url = '/products/' + id;
    return this._service.get(product_url)
      .map(response => {
        if (response['status'] == HttpStatusCode.OK) {
          let result = response.json();
          return <Product>result.data;
        }
        return new Product();
      })
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    return Observable.throw(error);
  }
}
