import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { Folder } from '../shared/reducers/folder';
import { Store } from '@ngrx/store';


import * as context from '../shared/reducers/context';
import * as fromRoot from '../shared/reducers/index';
import * as fromNote from '../shared/actions/note';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import { UrlService } from '@shared/services/url.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ZNoteService } from '@notes/shared/services/note.service';
import { Note } from '@shared/shared/models/note.model';
import { NoteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'z-note-search',
  templateUrl: 'search.component.html'
})
export class ZNoteSearchComponent implements OnInit, OnDestroy {
  readonly noteConstants: NoteConstants = new NoteConstants();

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  selectAll$: Observable<boolean>;
  currentFolderPath$: Observable<any[]>;
  viewMode$: Observable<any>;
  loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private noteService: ZNoteService,
    private store: Store<any>,
    private apiBaseService: ApiBaseService
  ) {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.viewMode$ = this.store.select(fromRoot.getViewMode);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.currentFolderPath$ = this.store.select(fromRoot.getCurrentFolderPath);
    this.selectAll$ = this.store.select(fromRoot.getSelectAll);
    this.loading$ = this.store.select(fromRoot.getLoading);

    this.route.queryParamMap.forEach(queryParamMap => {
      this.getSearchResult(queryParamMap.get('q'));
    })
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
  }

  getSearchResult(q: string): Promise<any> {
    return this.apiBaseService
      .get(`note/search`, { q })
      .toPromise().then((res: any) => {
        this.store.dispatch(new fromNote.LoadSuccess(res.data));
        this.store.dispatch({
          type: context.SET_CONTEXT,
          payload: {
            page: this.noteConstants.PAGE_SEARCH,
            pathTitle: 'Search',
            permissions: this.noteConstants.PAGE_PERMISSIONS.SEARCH,
            noData: this.noteConstants.NO_DATA.SEARCH
          }
        });
      });
  }

  onNewNote() {
    this.noteService.modalEvent({ action: 'note:open_note_add_modal' });
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }
}
