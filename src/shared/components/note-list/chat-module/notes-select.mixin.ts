import * as Boom from 'boom';
import { ChatNoteListModalComponent } from '@chat/shared/modal/note-list/note-list-modal.component';

export class NotesSelectMixin {
  notesListModal: ChatNoteListModalComponent;

  noteSelectOpen() {
    this.notesListModal.open();
  }

  noteSelectOnInsert(e: any) {
    throw Boom.notImplemented('this method should be implemented');
  }
}
