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
  ApiBaseService
}                           from '../../shared/services/apibase.service';
import {
  Category, 
  AddonService
}                           from './services.model'
import {
  Product
}                           from './dns/record'
import {UserService}        from '../../shared/services/user.service';

@Injectable()
export class ServicesService {

  /* [ Constructor ] */

  constructor(private _service: ApiBaseService,
    private _userService: UserService) {}

  /* [ Public Methods ] */

  //public getAddonServices(categoryId: number):Observable<AddonService[]> {
  public getAddonServices(categoryId: number): AddonService[] {
    return this.getAddonServiceByCategoryId(categoryId,this.getDummyServices());
    //@TODO: need to cache data from client to improve performance
    /*return this._service.get(this.getBaseUrl() + categoryId)
      .map((response:Response) => {
        if (response.status === 200 || response.status === 201) {
          let result = response.json();
          if (result.data == 'empty') {
            return [];
          }
          return <AddonService[]>result.data;
        }
        return [];
      })
      .do(data => console.log('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);*/
  }

  //public getCategories():Observable<Category[]> {
  public getCategories(): Category[] {
    return this.getDummyCategories();
    //@TODO: need to cache data from client to improve performance
    /*return this._service.get(this.getBaseUrl())
      .map((response:Response) => {
        if (response.status === 200 || response.status === 201) {
          let result = response.json();
          if (result.data == 'empty') {
            return [];
          }
          return <Category[]>result.data;
        }
        return [];
      })
      .do(data => console.log('JSON data: ' + JSON.stringify(data)))
      .catch(this.handleError);*/
  }

  public getProduct(id: number) : Observable<Product> {
    let product_url = '/products/' + id;
    return this._service.get(product_url)
      .map(response => {
        if (response.status == 200) {
          let result = response.json();
          return <Product>result.data;
        }
        return new Product();
      })
      .catch(this.handleError);
  }

  public addHost(body:string) {
    return this._service.post(`users/${this._userService.profile.id}/dns/records/`, body);
  }

  public addService(serviceId:number) {
    return this._service.post(`users/${this._userService.profile.id}/addonservices/${serviceId}`);
  }

  /* [ Event Handlers ] */

  private handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }

  /* [ Private Methods ] */

  private getBaseUrl() : string {
    return `users/${this._userService.profile.id}/addonservices/categories/`;
  }

  private getDummyServices(): AddonService[] {
    let addonservices = [
      {
        'id': 1,
        'created': false,
        'name' : 'Dynamic DNS',
        'author' : 'WTHApps',
        'templateId' : 'dynamic-dns.html',
        'templatePath': 'app/account/services/dynamic-dns.html',
        'img': 'http://52.221.221.245/assets/images/logo.png',
        'categories' : [
                         {
                           'id'   : 2,
                           'name' : 'Service'
                         }
                       ],
         'description' : 'Dynamic DNS (DDNS or DynDNS) is a method of automatically updating a name server in the Domain Name System (DNS), often in real time, with the active DDNS configuration of its configured hostnames, addresses or other information.'
      },
      {
        'id': 1,
        'name' : 'MS Outlook Addon',
        'created': false,
        'author' : 'WTHAddons',
        'templateId' : 'ms-outlook-addon.html',
        'templatePath': 'app/account/services/ms-outlook-addon.html',
        'img': 'http://52.221.221.245/assets/images/logo.png',
        'categories' : [
                         {
                           'id'   : 1,
                           'name' : 'Add-ons'
                         }
                       ],
         'description' : 'This add-in lets you configure rules that will automatically bcc or cc contacts of your choosing. When you regularly need to send important emails and need to conceal the identity of a recipient for security or privacy reasons, this tool gets the job done and lets you add a little bit of speed and cleverness to your email workflow'
      }
    ];
    return <AddonService[]>addonservices;
  }

  private getDummyCategories() : Category[] {
    let categories = [
      {'id' : 0, 'name' : 'All categories'},
      {'id' : 1, 'name' : 'Add-on'},
      {'id' : 2, 'name' : 'Service'}
    ];
    return <Category[]>categories;
  }

  private getAddonServiceByCategoryId(categoryId:number, 
    addonservices:AddonService[]) : AddonService[] {
    console.log(categoryId);
    let service:AddonService[] = [];
    for (var i in addonservices) {
      if (categoryId == 0) {
        service.push(addonservices[i]);
        continue;
      }
      for(var j in addonservices[i].categories) {
        if (addonservices[i].categories[j].id == categoryId) {
          service.push(addonservices[i]);
          break;
        }
      }
    }
    return  service;
  }
}
