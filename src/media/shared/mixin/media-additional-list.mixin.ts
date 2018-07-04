import { ApiBaseService, WthConfirmService } from '@shared/services';
/* MediaAdditionalListMixin will be merge to MediaBasicListMixin*/
export class MediaAdditionalListMixin {
  menuActions: any = {};
  subMenu: any;

  getMenuActions() {
    throw new Error('Should be overwrite this method');
  }
}
