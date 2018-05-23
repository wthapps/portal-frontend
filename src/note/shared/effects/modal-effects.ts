import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ZNoteService } from '../services/note.service';


import * as fromRoot from '../reducers/index';
import { CommonEventService } from '@shared/services/common-event/common-event.service';


@Injectable()
export class ModalEffects {
  constructor(private actions: Actions, public noteService: ZNoteService, private apiBaseService: ApiBaseService,
              private commonEventService: CommonEventService,
              private store: Store<fromRoot.State>) {
  }

}
