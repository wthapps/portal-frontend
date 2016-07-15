import {
  IViewModelBase
}                            from '../+services/services.interface';
import {
  StreamEmitter
  //, UserProductEventArgs
}                            from '../../shared/index';
import {
  AddonService
}                            from '../+services/services.model';

export class AccountMenuViewModel implements IViewModelBase {
  public user_products:AddonService[] = [];
  public hasUserProducts:boolean = false;
  private _subscriber:any;

  constructor(private _streamEmitter:StreamEmitter) {
  }

  public load():void {
    this._subscriber = this._streamEmitter.UserProducts.subscribe(o => this.process(o));
  }

  public unload():void {
    this._subscriber.unsubscribe();
  }

  //private process(args:UserProductEventArgs) {
  private process(args:any) {
    if (args.data === null) {
      this.user_products = args.products;
    } else {
      //@TODO: support adding method only
      let index = this.user_products.findIndex(o => o.id == args.data.id);
      if (index === -1) {
        let new_product:AddonService = <AddonService>args.data;
        this.user_products.push(new_product);
      }
    }
    this.hasUserProducts = this.user_products.length != 0;
  }
}
