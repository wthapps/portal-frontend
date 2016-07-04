import {
  AddonService //@TODO: will refactoring
}                        from '../account/services/services.model';
export abstract class DefaultEventArgs {
  constructor();
  constructor(data: Object);
  constructor(public data: Object = null) {}
}
export class UserProductEventArgs extends DefaultEventArgs {
  constructor();
  constructor(products:AddonService[]);
  constructor(public products:any = []) {
    super(null);
  }
}
