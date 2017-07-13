import { BaseModel } from '../../shared/models/base.model';

export class ProfileConfig extends BaseModel {
  // urls
  onLoadCustomUrl: string;
  onEditCustomUrl: string;
  // Components
  aboutAvatarComponent: boolean = true;
  aboutComponent: boolean = true;
  contactInfoComponent: boolean = true;
  workComponent: boolean = true;
  hobbyComponent: boolean = true;
  // variables
  getCurrentUser: boolean = true;
  createNew: boolean = false;
  // apis
  callApiAfterChange: boolean = true;
  constructor(obj?: any) {
    super();
    this.init(obj);
  }
}
