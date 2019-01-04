import { ConstantsBase } from '@shared/constant';

export class MediaConstants extends ConstantsBase {
  /*
    edit: Can add new items to current list
    enableEdit: Enable 'New' / 'New note' / 'New folder' buttons
   */
  SHARING_PERMISSIONS: any = {
    VIEW: 1,
    DOWNLOAD: 2,
    EDIT: 3,
    OWNER: 5
  };
}
const mediaConstants: MediaConstants = new MediaConstants();
export { mediaConstants };
