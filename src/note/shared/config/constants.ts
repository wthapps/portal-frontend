import { ConstantsBase } from "@shared/constant";

export class NoteConstants extends ConstantsBase {
  PAGE_MY_NOTE: any = 'MY_NOTE';
  PAGE_SHARED_WITH_ME: any = 'SHARED_WITH_ME';
  PAGE_SHARED_BY_ME: any = 'SHARED_BY_ME';
  PAGE_RECENT: any = 'RECENT';
  PAGE_INSIDE_FOLDER: any = 'INSIDE_FOLDER';
  PAGE_NOTE_EDIT: any = 'NOTE_EDIT';
  PAGE_NOTE_FAVOURITE: any = 'NOTE_FAVOURITE';

  /*
    edit: Can add new items to current list
    enableEdit: Enable 'New' / 'New note' / 'New folder' buttons
   */
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
      edit: false,
      enableEdit: true,
    },
    FAVOURITE: {
      edit: false,
      enableEdit: true,
    },
    RECENT: {
      edit: false,
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
    },
    FAVOURITE: {
      icon: 'fa fa-share-alt',
      title: 'There is no note favourite by you!',
      subTitle: 'Favourite Note',
    },
    RECENT: {
      icon: 'fa fa-clock-o',
      title: 'There is no recent note accessed by you!',
      subTitle: 'Recent Note',
    }
  }

  ACCESS_NAME: any = {
    1: ' Opened by me',
    2: ' Modified by me',
    3: ' Uploaded'
  }
}
let noteConstants: NoteConstants = new NoteConstants();
export {noteConstants};
