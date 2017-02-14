// import { ApiBaseService } from '../../../shared/services/apibase.service';

import {ApiBaseService} from "../../core/shared/services/apibase.service";
export class BaseSocialList {
  listItems: Array<any>;
  apiBaseService: ApiBaseService;

  loadList(url: string) {
    return this.apiBaseService.get(url);
  }
}
