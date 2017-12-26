import * as fromNote from './note';
import * as fromFolder from './folder';
import * as context from './context';
import * as fromMixedEntity from '../mixed-enity/mixed-entity.reducer';

export interface AppState {
  notes: fromNote.State;
  folders: fromFolder.State;
  mixedEntity: fromMixedEntity.State;
  context: any;
}
