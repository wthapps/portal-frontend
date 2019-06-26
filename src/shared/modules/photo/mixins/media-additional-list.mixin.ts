import { ApiBaseService, WthConfirmService } from '@shared/services';
/* MediaAdditionalListMixin will be merge to MediaBasicListMixin*/
export class MediaAdditionalListMixin {
  menuActions: any = {};

  getMenuActions() {
    throw new Error('Should be overwrite this method');
  }
  // validateActions:(menuActions: any, role_id: number) => any;
  validateActions(menuActions: any, role_id: number) {
    Object.keys(menuActions).forEach(k => {
      if (role_id < menuActions[k].permission) {
        menuActions[k].active = false;
      } else {
        menuActions[k].active = true;
      }
    });
    return menuActions;
  }
}
