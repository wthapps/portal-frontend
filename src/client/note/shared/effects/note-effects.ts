import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
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


import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';


@Injectable()
export class NoteEffects {
  @Effect() addNote = this.actions
    .ofType(note.ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    return this.noteService.create(payload)
      .map((res: any) => new note.NotesAdded([res['data']]))
      .catch(() => of(new note.NotesAdded([])))
      ;
    });

  @Effect() updateNote = this.actions
    .ofType(note.UPDATE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.noteService.update(payload)
        .map((res: any) => new note.NotesUpdated([res['data']]))
        .catch(() => empty())
        ;
    });


  @Effect() deleteNote = this.actions
    .ofType(note.DELETE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.noteService.multiDelete(payload)
        .map((res: any) => new note.NotesDeleted(res.data))
        .catch(() => of(new note.NotesDeleted([])))
        ;
    });

  @Effect() multiDeleteItems = this.actions
    .ofType(note.MULTI_DELETE)
    .withLatestFrom(this.store, (action: any, state: any) => state.notes.selectedIds)
    .switchMap((selectedIds: any[]) => {
      return this.noteService.multiDelete(selectedIds)
        .map((res: any) => new note.NotesDeleted(res.data))
        .catch(() => of(new note.NotesDeleted([])))
        ;
    });

  @Effect() load = this.actions
    .ofType(note.LOAD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    return this.apiBaseService.get(`note/dashboards`, {parent_id: payload['parent_id']})
      .map((res: any) => new note.LoadSuccess(res.data))
      .catch(() => of(new note.LoadSuccess([])));
    });

  // @Effect() initLoad = this.actions
  //   .ofType(note.INIT_LOAD)
  //   .map((action: any) => action['payload'])
  //   .switchMap((payload: any) => {
  //   return this.apiBaseService.get(`note/dashboards`, {parent_id: null})
  //     .map((res: any) => new note.InitLoadDone([res.data]))
  //     .catch(() => of(new note.InitLoadDone([])));
  //   })


  constructor(private actions: Actions, public noteService: ZNoteService, private apiBaseService: ApiBaseService,
              private store: Store<fromRoot.State>) {
  }

}

function createFilters(p: Params): Filters {
  return {folder: p['folder'] || null};
}
