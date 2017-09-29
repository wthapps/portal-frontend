import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { of } from 'rxjs/observable/of';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { Filters } from '../models/note';
import { ZNoteService } from '../services/note.service';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


import * as note from '../actions/note';


@Injectable()
export class NoteEffects {
  @Effect() addNote = this.actions
    .ofType(note.ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    console.debug('note effects - addNote: ', note);
    return this.noteService.create(payload)
      .do((note: any) => console.debug('Note create debug: ', note))
      .map((res: any) => new note.NotesAdded([res['data']]))
      .catch(() => of(new note.NotesAdded([])))
      ;
    });

  constructor(private actions: Actions, public noteService: ZNoteService) {
  }

}

function createFilters(p: Params): Filters {
  return {folder: p['folder'] || null};
}
