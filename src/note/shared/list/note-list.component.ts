import { Component, Input, ViewEncapsulation, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Note } from '@shared/shared/models/note.model';
import { ZNoteService } from '../services/note.service';
import * as fromRoot from '../reducers/index';
import * as context from '../reducers/context';
import * as note from '../actions/note';
import { Folder } from '../reducers/folder';
import { noteConstants, NoteConstants } from "../config/constants";

declare var _: any;

@Component({
  selector: 'note-list',
  templateUrl: 'note-list.component.html',
  styleUrls: ['note-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent implements OnInit {
  @Input() data: any[];
  @Input() items: any[];
  @Input() noteItems: Note[];
  @Input() folderItems: Folder[];
  @Input() allItems: any[];
  @Input() viewOption: string = 'grid';
  @Input() orderDesc: boolean;
  @Input() sortOption: any;
  @Input() isSelectAll: boolean;
  @Input() page: string;
  @Input() groupBy: string = 'date';

  noteConstants: NoteConstants = noteConstants;
  showDateCaret: boolean;
  loading$: Observable<boolean>;
  readonly DATE_MAP: any = noteConstants.DATE_MAP;
  readonly DATE_ARR: string[] = Object.keys(this.DATE_MAP);
  readonly SHARE_PAGES: string[] = [noteConstants.PAGE_SHARED_WITH_ME, noteConstants.PAGE_SHARED_BY_ME];

  readonly VIEW_MODE = {
    GRID: 'grid',
    LIST: 'list',
    TIMELINE: 'time'
  };

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    //if pressing ESC key
    if (ke.keyCode == 27) {
      this.deSelectObjects();
    }
  }

  constructor(public noteService: ZNoteService, public store: Store<fromRoot.State>) {
    this.loading$ = this.store.select(fromRoot.getLoading);
  }

  ngOnInit() {
  }

  onSort(name: any) {
    if (this.page !== this.noteConstants.PAGE_RECENT)
      // this.store.dispatch({type: context.SET_CONTEXT, payload: { sort:  {field: name, desc: this.sortOption.desc}}});
      if(this.sortOption.field === name)
        if(this.DATE_ARR.includes(this.sortOption.field))
          return;
        else
          this.onReverseSort();
      else
        this.store.dispatch({type: context.SET_CONTEXT, payload: { sort:  {...this.sortOption, field: name}}});
  }

  onReverseSort() {
    if (this.page !== this.noteConstants.PAGE_RECENT)
      this.store.dispatch({type: context.SET_CONTEXT, payload: { sort:  {...this.sortOption, desc: !this.sortOption.desc}}});
  }


  group(groupBy: any) {
    this.store.dispatch({type: context.SET_CONTEXT, payload: { groupBy }});
  }

  onSelectedAll() {
    this.store.dispatch(new note.SelectAll());
  }

  private deSelectObjects() {
    this.store.dispatch({type: note.DESELECT_ALL});
  }
}
