import {BaseZoneSocial} from "./base-social";
import {ApiBaseServiceV2} from "../../../shared/services/apibase.service.v2";

export class BaseSocialList extends BaseZoneSocial{
  listItems: Array<any>;
  apiBaseServiceV2: ApiBaseServiceV2;

  loadList(url:string) {
    return this.apiBaseServiceV2.get(url);
  }
}
