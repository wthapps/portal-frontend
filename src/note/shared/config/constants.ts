import { ConstantsBase } from "@shared/constant";

export class NoteConstants extends ConstantsBase {
  PAGE_MY_NOTE: any = 'MY_NOTE';
  PAGE_SHARED_WITH_ME: any = 'SHARED_WITH_ME';
  PAGE_SHARED_BY_ME: any = 'SHARED_BY_ME';

  PAGE_PERMISSIONS: any = {
    MY_NOTE: {
      canAdd: true,
    },
    SHARED_WITH_ME: {
      canAdd: false,
    },
    SHARED_BY_ME: {
      canAdd: true,
    }
  }

}

let noteConstants:any = new NoteConstants();
export {noteConstants};
