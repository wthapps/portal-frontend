import { ConstantsBase } from '@shared/constant';

export class NoteConstants extends ConstantsBase {
  PAGE_MY_NOTE: any = 'MY_NOTE';
  PAGE_SHARED_WITH_ME: any = 'SHARED_WITH_ME';
  PAGE_SHARED_BY_ME: any = 'SHARED_BY_ME';
  PAGE_RECENT: any = 'RECENT';
  PAGE_INSIDE_FOLDER: any = 'INSIDE_FOLDER';
  PAGE_NOTE_EDIT: any = 'NOTE_EDIT';
  PAGE_NOTE_FAVOURITE: any = 'NOTE_FAVOURITE';
  PAGE_SEARCH: any = 'NOTE_SEARCH';
  PAGE_TRASH: string = 'NOTE_TRASH';

  /*
    edit: Can add new items to current list
    enableEdit: Enable 'New' / 'New note' / 'New folder' buttons
   */
  PAGE_PERMISSIONS: any = {
    MY_NOTE: {
      edit: true,
      enableEdit: true
    },
    SHARED_WITH_ME: {
      edit: false,
      enableEdit: true
    },
    SHARED_BY_ME: {
      edit: false,
      enableEdit: true
    },
    FAVOURITE: {
      edit: false,
      enableEdit: true
    },
    RECENT: {
      edit: false,
      enableEdit: true
    },
    SEARCH: {
      edit: false,
      enableEdit: true
    }
  };

  NO_DATA: any = {
    MY_NOTE: {
      icon: 'fa fa-sticky-note',
      title: 'There is no note!',
      subTitle: 'Try to create one',
      newNode: true
    },
    SHARED_WITH_ME: {
      icon: 'wthico-shared-with-me',
      title: 'There is no note shared with you!',
      subTitle: 'Note can be shared by your connected contact'
    },
    SHARED_BY_ME: {
      icon: 'fa fa-share-alt',
      title: 'There is no note shared by you!',
      subTitle: 'Note can be shared to your connected contact'
    },
    FAVOURITE: {
      icon: 'fa fa-share-alt',
      title: 'There is no note favourite by you!',
      subTitle: 'Favourite Note'
    },
    RECENT: {
      icon: 'fa fa-clock-o',
      title: 'There is no recent note accessed by you!',
      subTitle: 'Recent Note'
    },
    SEARCH: {
      icon: 'fa fa-share-alt',
      title: 'There is match search result!',
      subTitle: 'Please try another keyword'
    }
  };

  ACCESS_NAME: any = {
    1: ' Last Opened',
    2: ' Last Modified',
    3: ' Uploaded'
  };

  OBJECT_TYPE: any = {
    NOTE: 'Note::Note',
    FOLDER: 'Note::Folder'
  };

  DATE_MAP: any = {
    created_at: 'Create date',
    updated_at: 'Last modified',
    shared_date: 'Share date'
  };

  FONTS = [
    // { name: 'Gotham', value: 'gotham' },
    { name: 'Georgia', value: 'georgia' },
    { name: 'Helvetica', value: 'helvetica' },
    { name: 'Courier New', value: 'couriernew' },
    { name: 'Lato', value: 'lato' },
    { name: 'Times New Roman', value: 'timesnewroman' },
    { name: 'Trebuchet', value: 'trebuchet' },
    { name: 'Verdana', value: 'verdana' }
  ];

  FONT_SIZES = [
    { name: '8', value: '8pt' },
    { name: '10', value: '10pt' },
    { name: '12', value: '12pt' },
    { name: '14', value: '14pt' },
    { name: '18', value: '18pt' },
    { name: '24', value: '24pt' },
    { name: '36', value: '36pt' }
  ];

  HEADINGS = [
    { name: 'Normal', value: 0 },
    { name: 'Heading 1', value: 1 },
    { name: 'Heading 2', value: 2 },
    { name: 'Heading 3', value: 3 },
    { name: 'Heading 4', value: 4 },
    { name: 'Heading 5', value: 5 },
    { name: 'Heading 6', value: 6 }
  ];
}
const noteConstants: NoteConstants = new NoteConstants();
export { noteConstants };
