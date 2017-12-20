import { BaseModel } from '../../../shared/shared/models/base.model';

export class ContactToolbarConfig extends BaseModel {
  listView: boolean = false;
  createView: boolean = false;
  detailView: boolean = false;

  constructor(obj?: any) {
    super();
    this.init(obj);
  }
}
