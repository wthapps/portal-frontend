import { ConstantsBase } from '@shared/constant';

export class ChatNoteConstants extends ConstantsBase {
  PAGE_MY_NOTE: any = 'MY_NOTE';
  PAGE_SHARED_WITH_ME: any = 'SHARED_WITH_ME';
  PAGE_SHARED_BY_ME: any = 'SHARED_BY_ME';
  PAGE_RECENT: any = 'RECENT';
  PAGE_INSIDE_FOLDER: any = 'INSIDE_FOLDER';
  PAGE_NOTE_EDIT: any = 'NOTE_EDIT';
  PAGE_NOTE_FAVOURITE: any = 'NOTE_FAVOURITE';
  PAGE_TRASH: string = 'NOTE_TRASH';
  // display
  PAGE_MY_NOTE_DISPLAY: any = 'My notes';
  PAGE_SHARED_WITH_ME_DISPLAY: any = 'Shared with me';
  PAGE_NOTE_FAVOURITE_DISPLAY: any = 'Favourites';
}
const chatNoteConstants: ChatNoteConstants = new ChatNoteConstants();
export { chatNoteConstants };
