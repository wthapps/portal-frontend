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
  ApiBaseService,
  UserService,
  Constants
}                           from '../../shared/index';
import {
  Category,
  AddonService
}                           from './services.model';

@Injectable()
export class ServicesService {
  constructor(
    private _service: ApiBaseService,
    private _userService: UserService
  ) {}

  // get all apps
  public getAddonServices():Observable<AddonService[]> {
    return this._service.get('/apps')
      .map((response:Response) => {
        if (response['status'] === Constants.HttpStatusCode.OK) {
          let body = JSON.parse(response['_body']);
          if (body.data == 'empty') {
            return [];
          }
          return <AddonService[]>body.data;
        }
        return [];
      });
      //.catch(this.handleError);
  }

  // Get all installed apps
  public getUserProducts():Observable<AddonService[]> {
    return this._service.get(`users/${this._userService.profile.id}/apps`)
      .map((response:Response) => {
        if (response['status'] === Constants.HttpStatusCode.OK) {
          let body = JSON.parse(response['_body']);
          if (body.data == 'empty') {
            return [];
          }
          return <AddonService[]>body.data;
        }
        return [];
      });
      //.catch(this.handleError);
  }

  public deleteUserProduct(id:number) {
    return this._service.delete(`users/${this._userService.profile.id}/apps/${id}`);
  }

  public getCategories():Observable<any[]> {
    return this._service.get('/apps/categories')
      .map((response: any) => {
        if (response['status'] === Constants.HttpStatusCode.OK ||
          response['status'] === Constants.HttpStatusCode.Created) {
          let body = JSON.parse(response['_body']);
          if (body.data == 'empty') {
            return [];
          }
          return body.data;
        }
        return [];
      });
      //.catch(this.handleError);
  }

  public addHost(body:string) {
    return this._service.post(`users/${this._userService.profile.id}/dns/records`, body);
  }

  public addService(serviceId:number) {
    return this._service.post(`users/${this._userService.profile.id}/apps/${serviceId}`, '');
  }

  /*private handleError(error:Response) {
    return Observable.throw(error);
  }*/

  /* tslint:disable */
  private getDummyServices():AddonService[] {
    let addonservices = [
      {
        'id': 1,
        'created': false,
        'product_categories_id': 1,
        'name': 'DynamicDNS',
        'display_name': 'Dynamic DNS',
        'template_id': 'dynamic-dns.html',
        'template_path': 'app/+account/+services/dynamic-dns.html',
        'img_src': 'http://52.221.221.245/assets/images/logo.png',
        'description': 'Dynamic DNS (DDNS or DynDNS) is a method of automatically updating a name server in the Domain Name System (DNS), often in real time, with the active DDNS configuration of its configured hostnames, addresses or other information.'
      },
      {
        'id': 1,
        'name': 'MSOutlookAddon',
        'product_categories_id': 2,
        'display_name': 'MS Outlook Addon',
        'created': false,
        'template_id': 'ms-outlook-addon.html',
        'template_path': 'app/+account/+services/ms-outlook-addon.html',
        'img_src': 'http://52.221.221.245/assets/images/logo.png',
        'description': 'This add-in lets you configure rules that will automatically bcc or cc contacts of your choosing. When you regularly need to send important emails and need to conceal the identity of a recipient for security or privacy reasons, this tool gets the job done and lets you add a little bit of speed and cleverness to your email workflow'
      }
    ];
    return <AddonService[]>addonservices;
  }

  private getDummyCategories():Category[] {
    let categories = [
      {'id': 0, 'name': 'Allcategories', 'display_name': 'All categories'},
      {'id': 1, 'name': 'Add-on', 'display_name': 'Add-on'},
      {'id': 2, 'name': 'Service', 'display_name': 'Service'}
    ];
    return <Category[]>categories;
  }
  /* tslint:enable */
}
