import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '@shared/services/apibase.service';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { Filters } from '../reducers/note';
import { ZNoteService } from '../services/note.service';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


import * as modal from '../actions/modal';
import * as fromRoot from '../reducers/index';
import { CommonEventService } from '@shared/services/common-event/common-event.service';


@Injectable()
export class ModalEffects {
  // @Effect({dispatch: false}) edit = this.actions
  //   .ofType(modal.EDIT)
  //   .map((action: any) => action['payload'])
  //   .withLatestFrom(this.store, (action: any, state: any) => state.notes.selectedObjects)
  //   .switchMap((selectedObjects: any[]) => {
  //     if(!(selectedObjects && selectedObjects[0])) {
  //       //  Throw error
  //       return empty();
  //     }
  //
  //   if(selectedObjects.length > 1) {
  //       //  Throw error
  //       return empty();
  //     }
  //
  //   switch(selectedObjects[0].object_type) {
  //     case 'note':
  //       this.noteService.modalEvent({action: 'note:open_note_edit_modal', payload: selectedObjects[0]});
  //       break;
  //     case 'folder':
  //       this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:edit', payload: selectedObjects[0]});
  //       break;
  //   }
  //
  //   return of();
  //   });

  constructor(private actions: Actions, public noteService: ZNoteService, private apiBaseService: ApiBaseService,
              private commonEventService: CommonEventService,
              private store: Store<fromRoot.State>) {
  }

}
