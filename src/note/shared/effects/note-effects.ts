import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ApiBaseService } from '@shared/services/apibase.service';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { ZNoteService } from '../services/note.service';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import * as context from '../reducers/context';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from "@shared/shared/components/confirmation/wth-confirm.service";
import { Router } from "@angular/router";
import { noteConstants } from "note/shared/config/constants";


@Injectable()
export class NoteEffects {

  constructor(private actions: Actions, public noteService: ZNoteService, private apiBaseService: ApiBaseService,
              private toastsService: ToastsService,
              private wthConfirmService: WthConfirmService,
              private router: Router,
              private store: Store<any>) {
  }

  @Effect() addNote = this.actions
    .ofType(note.ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      noteConstants
      return this.noteService.create(payload)
        .withLatestFrom(this.store, (res: any, state: any) => {
          if(state.context.permissions.edit) {
            return ({type: note.MULTI_NOTES_ADDED, payload: [res['data']]});
          } else {
            return ({type: note.MULTI_NOTES_ADDED, payload: []});
          }
        })
        .catch(() => of({type: note.MULTI_NOTES_ADDED, payload: []}));
    });

  @Effect() updateNote = this.actions
    .ofType(note.UPDATE)
    .withLatestFrom(this.store, (action: any, state: any) => [action, state.context])
    // .map(([action, context]: any) => action['payload'])
    .switchMap(([action, context]: any) => {
      return this.noteService.update(action['payload'])
        .map((res: any) => {
          // this.toastsService.success('Note updated successfully, yay');
          return ({type: note.NOTE_UPDATED, payload: res['data']});
        } )
        .catch(() => {
          // this.toastsService.danger('Note updated FAIL, something\'s wrong happened');
          this.wthConfirmService.confirm({
            message: 'The file you looking for was deleted or you do not have permission to access',
            header: 'Note not found',
            rejectLabel: null,
            accept: () => {
              if (context.page == noteConstants.PAGE_SHARED_WITH_ME) {
                this.store.dispatch({type: note.LOAD, payload: {parent_id: null, shared_with_me: true}});
              } else {
                this.store.dispatch({type: note.LOAD, payload: {parent_id: null}});
              }
              this.router.navigate([{outlets: {detail: null}}]);
            },
            reject: () => {
              if (context.page == noteConstants.PAGE_SHARED_WITH_ME) {
                this.store.dispatch({type: note.LOAD, payload: {parent_id: null, shared_with_me: true}});
              } else {
                this.store.dispatch({type: note.LOAD, payload: {parent_id: null}});
              }
              this.router.navigate([{outlets: {detail: null}}]);
            }
          });
          return empty();})
        ;
    });

  @Effect() deleteNote = this.actions
    .ofType(note.DELETE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.noteService.multiDelete(payload)
        .map((res: any) => ({type: note.NOTES_DELETED, payload: res.data}))
        .catch(() => of({type: note.NOTES_DELETED, payload: []}))
        ;
    });

  @Effect() multiDeleteItems = this.actions
    .ofType(note.MULTI_DELETE)
    .withLatestFrom(this.store, (action: any, state: any) => state.notes.selectedObjects)
    .switchMap((selectedObjects: any[]) => {
      return this.noteService.multiDelete(selectedObjects)
        .map((res: any) => ({type: note.NOTES_DELETED, payload: res.data}))
        .catch(() => of({type: note.NOTES_DELETED, payload: []}))
        ;
    });

  @Effect() load = this.actions
    .ofType(note.LOAD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    this.store.dispatch({type: context.SET_CONTEXT, payload: {loading: true}})
    return this.apiBaseService.get(`note/mixed_entities`, payload)
      .mergeMap((res: any) => { return [
          {type: note.LOAD_SUCCESS, payload: res.data},
          {type: context.SET_CONTEXT, payload: {loading: false}},
          {type: note.SET_LIST_PERMISSION, payload: {canAdd: true}}]; })
          .catch(() => {
            // this.toastsService.danger('Note updated FAIL, something\'s wrong happened');
            this.wthConfirmService.confirm({
              message: 'The folder you looking for was deleted or you do not have permission to access',
              header: 'Folder not found',
              rejectLabel: null,
              accept: () => {
                this.router.navigate(["my-note"]);
              },
              reject: () => {
                this.router.navigate(["my-note"]);
              }
            });
            return empty();})
    });


  @Effect() trashLoad = this.actions
    .ofType(note.TRASH_LOAD)
    .switchMap(() => {
      return this.apiBaseService.get(`note/trashs`)
        .mergeMap((res: any) => { return [
          {type: note.LOAD_SUCCESS, payload: res.data},
          {type: note.SET_LIST_PERMISSION, payload: {canAdd: false}}]; })
        .catch(() => of({type: note.LOAD_SUCCESS, payload: []}));
    });

  @Effect() restore = this.actions
    .ofType(note.RESTORE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.apiBaseService.post(`note/trashs/restore`, {objects: payload} )
        .map((res: any) => ({type: note.NOTES_DELETED, payload: res.data}))
        .catch(() => of({type: note.NOTES_DELETED, payload: []}));
    });

  @Effect() permanentDelete = this.actions
    .ofType(note.PERMANENT_DELETE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.apiBaseService.post(`note/trashs/permanent_delete`, {objects: payload})
        .map((res: any) => ({type: note.NOTES_DELETED, payload: res.data}))
        .catch(() => of({type: note.NOTES_DELETED, payload: []}));
    });

  @Effect() emptyAll = this.actions
    .ofType(note.EMPTY_ALL)
    .switchMap(() => {
      return this.apiBaseService.post(`note/trashs/empty_all`)
        .map((res: any) => ({type: note.ALL_DELETED}))
        .catch(() => empty());
    });

    @Effect() removeShareWithMe = this.actions
      .ofType(note.REMOVE_SHARE_WITH_ME)
      .map((action: any) => action['payload'])
      .switchMap((payload: any) => {
        return this.apiBaseService.post(`note/sharings/remove_share_with_me`, {objects: payload.map((i: any) => {return {id: i.id, object_type: i.object_type}})})
          .map((res: any) => ({type: note.REMOVED_SHARE_WITH_ME, payload: res.data}))
          .catch(() => empty());
      });
}
