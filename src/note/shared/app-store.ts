import * as fromFolder from './reducers/folder';
import * as fromNote from './reducers/note';
import * as fromShareModal from './reducers/share-modal';
import * as fromContext from './reducers/context';
import * as progressContext from './reducers/progress-context';
import * as  fromMixedEntity from './mixed-enity/mixed-entity.reducer';

import { MixedEntityEffects } from './mixed-enity/mixed-entity.effects';
import { NoteEffects } from './effects/note-effects';
import { FolderEffects } from './effects/folder-effects';

export const AppStore = {
  mixedEntity: fromMixedEntity.reducer,
  notes: fromNote.reducer,
  folders: fromFolder.reducer,
  context: fromContext.reducer,
  progressContext: progressContext.reducer,
  share: fromShareModal.reducer
};

export let AppEffects: Array<any> = [MixedEntityEffects, NoteEffects, FolderEffects];
