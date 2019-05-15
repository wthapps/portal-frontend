import * as fromNote from './note';
import * as fromFolder from './folder';
import * as context from './context';

export interface AppState {
  notes: fromNote.State;
  folders: fromFolder.State;
  context: any;
}
