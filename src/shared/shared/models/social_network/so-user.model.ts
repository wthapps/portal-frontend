import { BaseInput } from '../base/base-input.model';
import { FromData } from '../base/interfaces/from-data';

export class SoUser extends BaseInput implements FromData {
  uuid: string = '';
  nickname: string = '';
  profile_image: string = '';
  settings: any;

  from(fields: any) {
    if (fields) {
      Object.assign(this, fields);
    }
    if (this.settings.searchable_contact.value == 'public') this.settings.check_contact_any = 'checked';
    if (this.settings.searchable_contact.value == 'friends') this.settings.check_contact_friends = 'checked';

    return this;
  }
}
