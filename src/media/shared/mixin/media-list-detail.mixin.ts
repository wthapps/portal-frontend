import { ApiBaseService, WthConfirmService } from '@shared/services';
/* MediaListDetailMixin for album detail, playlist detaill*/
export class MediaListDetailMixin {
  object: any;

  loadObject(input?: any) {
    throw new Error('Should be overwrite');
  }
}
