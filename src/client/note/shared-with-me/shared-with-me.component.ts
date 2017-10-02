import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import { Note } from '../../core/shared/models/note.model';
@Component({
  moduleId: module.id,
  selector: 'z-note-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZNoteSharedWithMeComponent implements OnDestroy, OnInit {
  public notes$: Observable<Note[]>;
  public orderDesc$: Observable<boolean>;
  viewOption: string = 'list';
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.destroySubject)
      .switchMap((params: any) => { return this.noteService.getAll();})
      .subscribe((res: any) => {
        this.store.dispatch(new note.LoadSuccess(res.data));
      });

    this.notes$ = this.store.select(fromRoot.getSortedNotes);
    this.orderDesc$ = this.store.select(fromRoot.getOrderDesc);
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}
