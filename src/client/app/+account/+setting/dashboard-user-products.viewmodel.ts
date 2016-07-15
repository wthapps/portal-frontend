import {
  Router
}                            from '@angular/router';
import {
  IViewModelBase
}                            from '../+services/services.interface';
import {
  StreamEmitter,
  UserProductEventArgs,
  Constants,
  DialogService
}                            from '../../shared/index';
import {
  AddonService
}                            from '../+services/services.model';
import {
  ServicesService
}                            from '../+services/services.service';
export class DashboardUserProductsViewModel implements IViewModelBase {
  public user_products:AddonService[] = [];
  public hasUserProducts:boolean = false;
  public inValidPlan:boolean = false;

  constructor(private _streamEmitter:StreamEmitter,
              private _servicesService:ServicesService,
              private _dialogService:DialogService,
              private _router:Router) {
  }

  public load():void {
    this.inValidPlan = false;
    this.user_products = [];
    this._servicesService.getUserProducts().subscribe(
      addonservices => {
        this.inValidPlan = false;
        this.user_products = addonservices;
        this.hasUserProducts = addonservices.length !== 0;
        this._streamEmitter.UserProducts.send(new UserProductEventArgs(addonservices));
      },
      error => {
        let body = JSON.parse(error['_body']);
        if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
          if (body.data !== 'empty') {
            let result = <AddonService[]>body.data;
            this.hasUserProducts = result.length != 0;
            this.user_products = result;
            this._streamEmitter.UserProducts.send(new UserProductEventArgs(result));
          }
        } else {
          console.log(error);
        }
      }
    );
  }

  public unload():void {
    console.log('unload');
  }

  public onRemove(event:any, product:AddonService):void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    }
    this._dialogService.activate(
      'Are you sure to remove ' + product.display_name + '?',
      'Manage Services or Add-ons',
      'Yes',
      'No')
      .then((responseOK) => {
        if (responseOK) {
          let index = this.user_products.findIndex(o => o.id == product.id);
          this._servicesService.deleteUserProduct(product.id).subscribe(
            response => {
              if (response['status'] === Constants.HttpStatusCode.OK) {
                this.user_products.splice(index, 1);
                this.hasUserProducts = this.user_products.length != 0;
                this._streamEmitter.UserProducts.send(new UserProductEventArgs(this.user_products));
              }
            },
            error => {
              if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
                this.showUpgrading();
              } else {
                console.log(error);
              }
            }
          );
        }
      });
  }

  private showUpgrading():void {
    this._dialogService.activate('Upgrading your accounts to continute?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this._router.navigateByUrl('/account/payment');
      }
    });
  }
}
