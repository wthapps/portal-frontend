import { ConstantsBase } from "@shared/constant";

export class NoteConstants extends ConstantsBase {
  PAGE_MY_NOTE: any = 'MY_NOTE';
  PAGE_SHARED_WITH_ME: any = 'SHARED_WITH_ME';
  PAGE_SHARED_BY_ME: any = 'SHARED_BY_ME';

  PAGE_PERMISSIONS: any = {
    MY_NOTE: {
      edit: true,
      enableEdit: true,
    },
    SHARED_WITH_ME: {
      edit: false,
      enableEdit: true,
    },
    SHARED_BY_ME: {
      edit: true,
      enableEdit: true,
    }
  }

  NO_DATA: any = {
    MY_NOTE: {
      icon: 'fa fa-sticky-note',
      title: 'There is no note!',
      subTitle: 'Try to create one',
      newNode: true,
    },
    SHARED_WITH_ME: {
      icon: 'wthico-shared-with-me',
      title: 'There is no note shared with you!',
      subTitle: 'Note can be shared by your connected contact',
    },
    SHARED_BY_ME: {
      icon: 'fa fa-share-alt',
      title: 'There is no note shared by you!',
      subTitle: 'Note can be shared to your connected contact',
    }
  }
}
let noteConstants:any = new NoteConstants();
export {noteConstants};
